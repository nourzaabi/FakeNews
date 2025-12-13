# %%
# !pip install transformers datasets sentencepiece


import pandas as pd
import re

df = pd.read_csv("/home/slim/FakeNews/data/WELFake_Dataset.csv")

df = df.rename(columns={
    "title": "title",
    "text": "text",
    "label": "label"
})

print(df.head())
print(df.label.value_counts(normalize=True))

import re

def clean_text(t):
    if pd.isna(t):
        return ""
    t = str(t).lower()
    t = re.sub(r"http\S+", "", t)
    t = re.sub(r"[^a-zA-Z0-9\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

df["text_clean"] = df["text"].apply(clean_text)
df["title_clean"] = df["title"].apply(clean_text)

df = df[df["text_clean"].str.len() > 10]
df = df.dropna(subset=["label"])


df["combined"] = df["title_clean"] + " [SEP] " + df["text_clean"]


from sklearn.model_selection import train_test_split

train_texts, temp_texts, train_labels, temp_labels = train_test_split(
    df["combined"].tolist(),
    df["label"].tolist(),
    test_size=0.30,
    random_state=42,
    stratify=df["label"]
)

val_texts, test_texts, val_labels, test_labels = train_test_split(
    temp_texts,
    temp_labels,
    test_size=0.50,
    random_state=42,
    stratify=temp_labels
)

from transformers import RobertaTokenizer

tokenizer = RobertaTokenizer.from_pretrained("roberta-large")


import torch
from torch.utils.data import Dataset

class FakeNewsDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=256):
        self.encodings = tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=max_length
        )
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_dataset = FakeNewsDataset(train_texts, train_labels, tokenizer)
val_dataset   = FakeNewsDataset(val_texts,   val_labels, tokenizer)
test_dataset  = FakeNewsDataset(test_texts,  test_labels, tokenizer)

from transformers import RobertaForSequenceClassification

model = RobertaForSequenceClassification.from_pretrained(
    "roberta-large",
    num_labels=2
)


from transformers import TrainingArguments, Trainer, EarlyStoppingCallback
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)
    p, r, f1, _ = precision_recall_fscore_support(labels, preds, average="weighted")
    acc = accuracy_score(labels, preds)

    return {"accuracy": acc, "precision": p, "recall": r, "f1": f1}

training_args = TrainingArguments(
    output_dir="./roberta_fakenews",
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_strategy="epoch",

    save_total_limit=2,
    load_best_model_at_end=True,

    learning_rate=2e-5,
    per_device_train_batch_size=4,     
    per_device_eval_batch_size=4,
    gradient_accumulation_steps=4,      # Effective batch size = 16
    num_train_epochs=4,
    fp16=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=1)]
)

trainer.train()

test_metrics = trainer.evaluate(test_dataset)
print(test_metrics)

from sklearn.metrics import classification_report, confusion_matrix

preds = trainer.predict(test_dataset)
y_true = preds.label_ids
y_pred = preds.predictions.argmax(axis=1)

print(classification_report(y_true, y_pred))
print(confusion_matrix(y_true, y_pred))

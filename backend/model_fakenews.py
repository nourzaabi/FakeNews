import random

def predict_text(text: str):
    """
    Fake model for testing frontend + backend.
    Generates random but realistic predictions.
    """

    # Random fake/real
    prediction = random.choice(["Fake News", "Real News"])

    # Random confidence
    confidence = random.randint(50, 100)

    # Fake counter argument only if prediction = Fake News
    counter = ""
    if prediction == "Fake News":
        counter = (
            "This article contains information that appears unreliable. "
            "Consider checking credible sources such as Reuters, AP News, "
            "or fact-checking websites before sharing."
        )

    return {
        "prediction": prediction,
        "confidence": confidence,
        "counterArgument": counter
    }

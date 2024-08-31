from flask import Flask, jsonify, request
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS

import os
from supabase import create_client, Client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["GET"])
def use_model():
    request_image = request.args.get('id')
    if not request_image:
        return "Please provide an image"
    res = supabase.storage.from_('images').list()

    # print(res)

    def get_image():
        for item in res:
            # check if item is an int
            if not isinstance(item, int):
                print(item['name'])
                if item['name'] != ".emptyFolderPlaceholder":
                    if item['name'].split('.')[0] == request_image:
                        return item

    current_image = get_image()
    if current_image is None:
        return {
            "error": "Image not found"
        }

    name = current_image['name']

    # download the image
    with open("images/"+name, 'wb+') as f:
        res = supabase.storage.from_('images').download(name)
        f.write(res)


    print(get_image())

    # Load the pre-trained model
    model = load_model('skin_cancer_detection_vgg16.h5')

    # Path to the single image file (change later)
    img_path = 'images/'+name

    # Load the image, resize it to 224x224 pixels, and scale pixel values
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Rescale pixel values

    prediction = model.predict(img_array)

    # Interpret the prediction
    class_labels = ['melanoma', 'nevus', 'seborrheic_keratosis']
    predicted_class = np.argmax(prediction, axis=1)[0]  # Get index of the highest probability

    # Print the prediction result
    print(f"The image is predicted to be: {class_labels[predicted_class]} with probability {np.max(prediction) * 100:.2f}%")

    # delete
    os.system("rm images/"+name)

    # return json with probability and class
    return jsonify({
        # return capitalized class name and remove underscores
        "class": class_labels[predicted_class].replace("_", " ").title(),
        "probability": float(np.max(prediction) * 100)
    })

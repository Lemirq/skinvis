import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

model = load_model('skin_cancer_detection_vgg16.h5')

# Path to the single image file (change later)
img_path = 'mini_dataset/valid/melanoma/ISIC_0012099.jpg'

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

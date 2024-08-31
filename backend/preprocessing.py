"""
Downscale images from the original dataset by a scale factor of 0.05.
The dataset: 11.3gb --> 9.76mb
"""
import os
from PIL import Image

def rescale_images(input_dir, output_dir, scale_factor=0.05):
    os.makedirs(output_dir, exist_ok=True)

    for root, dirs, files in os.walk(input_dir):
        for dir_name in dirs:
            os.makedirs(os.path.join(output_dir, os.path.relpath(os.path.join(root, dir_name), input_dir)), exist_ok=True)

        for file_name in files:
            if file_name.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
                img_path = os.path.join(root, file_name)
                img = Image.open(img_path)
                new_size = tuple([int(x * scale_factor) for x in img.size])
                img_rescaled = img.resize(new_size, Image.Resampling.LANCZOS)
                new_img_path = os.path.join(output_dir, os.path.relpath(img_path, input_dir))
                img_rescaled.save(new_img_path)
                print(f'Rescaled {img_path} and saved to {new_img_path}')


input_dir = 'dataset'
output_dir = 'mini_dataset'

rescale_images(input_dir, output_dir)
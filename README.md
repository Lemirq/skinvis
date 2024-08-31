# SkinVis
![header image](https://github.com/Lemirq/skinvis/blob/master/skinvis.png?raw=true)

## Inspiration 💡
Skin cancer is a formidable foe, silently lurking in the shadows of our sun-kissed days. We discovered that 1 in 5 Americans will develop skin cancer by the age of 70, and more than 2 people die of skin cancer every hour in the U.S. alone. Although, when detected early, the 5-year survival rate for melanoma is 99%. Our goal was to create an accessible yet accurate skin cancer detection model that can empower individuals to take control of their health and detect potential skin cancer early, ultimately saving lives.

## What it does 💻
SkinVis AI is an innovative tool designed to detect skin cancer early. Users can simply upload an image of a skin lesion, and SkinVis will classify it as melanoma, nevus, or seborrheic keratosis. Additionally, the SkinVis chatbot acts as a personal skin disease assistant, answering questions related to skin conditions and symptoms, making it a comprehensive resource for skin health.

## How we built it 🛠️
![flowchart](https://github.com/Lemirq/skinvis/blob/master/flow.png?raw=true)
We built SkinVis using a robust combination of front-end and back-end technologies. The front end was developed using Next.js, Supabase, and Tailwind CSS, ensuring a seamless and modern user experience. For the UI elements, we incorporated Shadcn UI for a consistent and polished look. On the back end, we employed a Flask API that processes uploaded images, feeding them into our pre-trained VGG16 model. The model then returns a JSON object with the identified class and its probability, providing users with accurate and reliable results.

## Challenges we ran into ❌
One of the significant challenges we faced was ensuring the accuracy of our model. Training the VGG16 model to effectively differentiate between similar skin conditions required extensive data augmentation and preprocessing. Another challenge was integrating the front-end and back-end components seamlessly, ensuring that the image upload, processing, and chat functionalities worked harmoniously.

## Accomplishments that we're proud of 🏆
We’re proud of creating a functional and accessible tool that can make a real difference in people's lives. Achieving a 71% accuracy rate after just 20 epochs of training is a significant milestone, given the complexity of skin cancer detection. We're also proud of the seamless integration of our chatbot, which adds another layer of user engagement and support.

## What we learned 📝
Throughout this project, we learned the importance of balancing accuracy with accessibility. Building an AI tool that people can trust with their health requires not just technical expertise, but also a deep understanding of user experience. We also learned how to optimize the VGG16 model for our specific use case, enhancing its performance in detecting skin cancer.

## What's next for SkinVis 🚀
The next steps for SkinVis include further refining our model to improve its accuracy, expanding the database with more diverse skin images, and enhancing the chatbot’s capabilities to provide even more detailed and personalized advice. We also plan to develop a mobile app version of SkinVis to make it even more accessible to users worldwide, empowering more people to detect skin cancer early.

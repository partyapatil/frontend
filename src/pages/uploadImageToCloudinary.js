import { toast } from "react-toastify";
require("dotenv").config(); 
export const uploadImageToCloudinary = async (pics, setLoading, setImageUrl) => {
  setLoading(true);

  if (!pics) {
    toast.warning("Please select an image!");
    setLoading(false);
    return;
  }

  if (pics.type === "image/jpeg" || pics.type === "image/png") {
    const formData = new FormData();
    formData.append("file", pics);
      formData.append("upload_preset", "chatApp"); // Your upload preset
      formData.append("cloud_name", "ddpunpqre"); // Your Cloudinary cloud name

    try {
      const res = await fetch( 
        process.env.REACT_APP_CLOUDINARY_URL ,
        {
          method: "post",
          body: formData,
        }
      );
      const data = await res.json();
      const imageUrl = data.secure_url;
      setImageUrl(imageUrl); // Update state with image URL
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image!");
      setLoading(false);
    }
  } else {
    toast.error("Invalid File Type. Please select a JPEG or PNG image.");
    setLoading(false);
  }
};

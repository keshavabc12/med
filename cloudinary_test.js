const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary inline
cloudinary.config({
  cloud_name: 'durhxlcnt',
  api_key: '465439466783197',
  api_secret: 'nimT_zfMX6WfPGwxliN6-dofJPo'
});

async function run() {
  try {
    console.log("Starting Cloudinary test script...");

    // 2. Upload an image from Cloudinary's demo domains
    const imageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    console.log("Uploading sample image...");
    
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      public_id: "test_sample"
    });

    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    // 3. Get image details
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log("Width:", details.width);
    console.log("Height:", details.height);
    console.log("Format:", details.format);
    console.log("File Size (bytes):", details.bytes);

    // 4. Transform the image
    // f_auto (fetch_format: 'auto') automatically delivers the best image format for the browser
    // q_auto (quality: 'auto') automatically optimizes compression to reduce file size without visible loss
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });

    console.log("Done! Click link below to see optimized version of the image. Check the size and the format.");
    console.log("Transformed URL:", transformedUrl);

  } catch (error) {
    console.error("Error running script:", error);
  }
}

run();

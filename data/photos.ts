// Photos shown on the /photos wall. Web-optimized copies (max 1600px)
// live in public/photos/web/; the wall itself renders small copies from
// public/photos/thumb/ (max 800px) — when adding a photo, generate its
// thumb too: sips -Z 800 -s format jpeg -s formatOptions 70 web/<f> --out thumb/<f>
// w/h are the full image's pixel dimensions; they
// let the wall lay out before images load, which keeps the infinite loop
// stable — every entry needs them. Captions appear on hover and in the
// lightbox; leave "" for none. Reorder entries to change the wall order.
export type Photo = {
  src: string;
  w: number;
  h: number;
  caption: string;
};

export const photos: Photo[] = [
  { src: "/photos/web/img_9615.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5859.jpg", w: 1600, h: 1060, caption: "" },
  { src: "/photos/web/img_9583.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_3021.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_9511.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/93a40bf0-4d46-4d15-9fe8-375e8e4239a1.jpg", w: 1600, h: 900, caption: "" },
  { src: "/photos/web/img_6433.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_4735.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5190.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_4794.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5426.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_9794.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_4702.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_9604.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5865.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_9426.jpg", w: 1195, h: 1600, caption: "" },
  { src: "/photos/web/img_5416.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_7470.jpg", w: 1245, h: 1600, caption: "" },
  { src: "/photos/web/img_4090.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_9366.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_9601.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_9582.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_1746.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5375.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_3778.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_3702.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_4815.jpg", w: 1066, h: 1600, caption: "" },
  { src: "/photos/web/img_4980.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_4044.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5075.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_4874.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_6240.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_9527.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_0801.jpg", w: 1199, h: 1600, caption: "" },
  { src: "/photos/web/img_9793.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_4834.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_5380.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_3885.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_4659.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_9587.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/export-8.jpg", w: 1280, h: 1600, caption: "" },
  { src: "/photos/web/img_9600.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5882.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_5165.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_4383.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_1475.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_4832.jpg", w: 1600, h: 1200, caption: "" },
  { src: "/photos/web/img_9639.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_6414.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_3467.jpg", w: 1200, h: 1600, caption: "" },
  { src: "/photos/web/img_6445.jpg", w: 1200, h: 1600, caption: "" },
];

import { pipeline } from "@huggingface/transformers";

class MyTranslationPipeline {
  static task = "text-to-speech";
  static model = "Xenova/speecht5_tts";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let audio = await MyTranslationPipeline.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });

  const speaker_embeddings =
    "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin";
  const out = await audio(event.data.text, {
    speaker_embeddings,
  });

  /*  // Actually perform the translation
  let output = await translator(event.data.text, {
    tgt_lang: event.data.tgt_lang,
    src_lang: event.data.src_lang,

    // Allows for partial output
    callback_function: (x) => {
      self.postMessage({
        status: "update",
        output: translator.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        }),
      });
    },
  });*/

  /*  try {
    const wav = new wavefile.WaveFile();
    wav.fromScratch(1, out.sampling_rate, "32f", out.audio);
    fs.writeFileSync("out.wav", wav.toBuffer());
    console.log("Wrote file to out.wav");
  } catch (err) {
    console.error(err);
  }*/

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: out,
  });
});

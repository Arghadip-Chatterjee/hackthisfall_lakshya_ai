import  Configuration  from "openai";
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = true,
  openai_json_mode: boolean = true  // New parameter for OpenAI JSON Mode
) {
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  const error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output ${list_output && "an array of objects in"
      } the following in json format: ${JSON.stringify(
        output_format
      )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf the output field is a list, classify the output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate an array of JSON, one JSON for each input element.`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: openai_json_mode ? "gpt-3.5-turbo-1106" : model,
        messages: [
          {
            role: "system",
            content: system_prompt + output_format_prompt + error_msg,
          },
          { role: "user", content: user_prompt.toString() },
        ],
        temperature,
      });

      const res: any = response.choices[0].message?.content?.replace(/'/g, '"') ?? "";

      // Wrap all property names and string values in double quotes
      const fixedJSON = res.replace(/([{,]\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$2":');

      if (verbose) {
        console.log(
          "System prompt:",
          system_prompt + output_format_prompt + error_msg
        );
        console.log("\nUser prompt:", user_prompt);
        console.log("\nGPT response:", res);
      }

      console.log("GPT response (before parsing):", res);
      console.log("GPT response (before parsing) in fixedJSON:", fixedJSON);
      let output: any = JSON.parse(fixedJSON);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of JSON");
        }
      } else {
        output = [output];
      }

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) {
            continue;
          }

          if (!(key in output[index])) {
            throw new Error(`${key} not in JSON output`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];

            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }

            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }

            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      // error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      // console.log("Current invalid JSON format ", res);
    }
  }

  return [];
}

'use server';
/**
 * @fileOverview This file defines a Genkit flow that identifies an object in an image, removes the background,
 * and generates a visual card with the image, object name, and category.
 *
 * - identifyObjectAndGenerateCard - A function that orchestrates the object identification, background removal, and card generation process.
 * - IdentifyObjectAndGenerateCardInput - The input type for the identifyObjectAndGenerateCard function.
 * - IdentifyObjectAndGenerateCardOutput - The return type for the identifyObjectAndGenerateCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyObjectAndGenerateCardInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type IdentifyObjectAndGenerateCardInput = z.infer<typeof IdentifyObjectAndGenerateCardInputSchema>;

const IdentifyObjectAndGenerateCardOutputSchema = z.object({
  cardDataUri: z
    .string()
    .describe(
      'A data URI containing the generated visual card, including the image, object name, and category.'
    ),
  objectName: z.string().describe('The identified name of the object in the image.'),
  category: z.string().describe('The category of the identified object.'),
});
export type IdentifyObjectAndGenerateCardOutput = z.infer<typeof IdentifyObjectAndGenerateCardOutputSchema>;

export async function identifyObjectAndGenerateCard(
  input: IdentifyObjectAndGenerateCardInput
): Promise<IdentifyObjectAndGenerateCardOutput> {
  return identifyObjectAndGenerateCardFlow(input);
}

const identifyObjectPrompt = ai.definePrompt({
  name: 'identifyObjectPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: IdentifyObjectAndGenerateCardInputSchema},
  output: {schema: z.object({objectName: z.string(), category: z.string()})},
  prompt: `You are an AI assistant specialized in identifying objects in images and determining their category.
  Given the image, identify the object and its category. Return the object name and category.
  
  Image: {{media url=photoDataUri}}
  `,
});

const removeBackgroundAndGenerateCardPrompt = ai.definePrompt({
  name: 'removeBackgroundAndGenerateCardPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: z.object({photoDataUri: z.string(), objectName: z.string(), category: z.string()})},
  output: {schema: z.object({cardDataUri: z.string()})},
  prompt: `You are an AI assistant specialized in removing backgrounds from images and generating visual cards.
  Given the image of an object with the background, remove the background and generate a visual card with the image, object name, and category.
  Return the card as a data URI.
  
  Object Name: {{{objectName}}}
  Category: {{{category}}}
  Image: {{media url=photoDataUri}}
  `,
});

const identifyObjectAndGenerateCardFlow = ai.defineFlow(
  {
    name: 'identifyObjectAndGenerateCardFlow',
    inputSchema: IdentifyObjectAndGenerateCardInputSchema,
    outputSchema: IdentifyObjectAndGenerateCardOutputSchema,
  },
  async input => {
    const {output: identificationResult} = await identifyObjectPrompt(input);

    if (!identificationResult) {
      throw new Error('Could not identify object.');
    }

    const {output: cardGenerationResult} = await removeBackgroundAndGenerateCardPrompt({
      photoDataUri: input.photoDataUri,
      objectName: identificationResult.objectName,
      category: identificationResult.category,
    });

    if (!cardGenerationResult) {
      throw new Error('Could not generate card.');
    }

    return {
      cardDataUri: cardGenerationResult.cardDataUri,
      objectName: identificationResult.objectName,
      category: identificationResult.category,
    };
  }
);

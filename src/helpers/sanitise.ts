import { BadRequestError } from "@core/errors";
import { z } from "zod";

interface SanitiseDataOptions {
  lowerCase?: boolean;
}

/**
 * Small helper function to remove whitespace and trim
 * @example sanitiseData("LaSt    Train    ") // "LaSt Train"
 */
export const sanitiseData = (
  input: string,
  options?: SanitiseDataOptions,
): string => {
  const rmWhitespaceRegex = /\s\s+/g;
  const sanitisedInput = input.trim().replace(rmWhitespaceRegex, " ");

  if (options?.lowerCase) {
    return sanitisedInput.toLowerCase();
  }
  return sanitisedInput;
};

/**
 * Small helper function to remove whitespace, trim and return camelcase for redis identifier
 * @example sanitiseData("LaSt    Train    ") // "LastTrain"
 */
export const createRedisIdentifier = (input: string): string => {
  const rmWhitespaceRegex = /\s\s+/g;
  return input
    .toLowerCase()
    .trim()
    .replace(rmWhitespaceRegex, " ")
    .split(" ")
    .join(":");
};

/**
 * Will remove whitespace from data and check against schema passed in as second argument
 * @returns sanitised data
 */
export const isValidData = <T extends Record<string, string>>(
  input: T,
  schema: z.ZodSchema<T>,
): T => {
  const newInput: T = input;
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      newInput[key] = sanitiseData(input[key] as string) as T[Extract<
        keyof T,
        string
      >];
    }
  }

  const isValid = schema.safeParse(newInput);
  if (!isValid.success) {
    throw new BadRequestError();
  }
  return newInput as T;
};

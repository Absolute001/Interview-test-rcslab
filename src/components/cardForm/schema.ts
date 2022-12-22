import { pipe } from "fp-ts/lib/function";
import { NonEmptyString } from "io-ts-types";
import * as O from "fp-ts/Option";
import { z } from "zod";
import {
  expirationDate,
  has16Digits,
  isLuhnValid,
} from "../../utils/functions";

export const cardsAddSchema = z.object({
  cardNumber: z
    .string()
    .min(1)
    .refine((val) =>
      pipe(
        val as NonEmptyString,
        O.fromNullable,
        O.bindTo("value"),
        O.bind("has16digits", ({ value }) => has16Digits(value)),
        O.bind("isLuhnValid", ({ value }) => isLuhnValid(value)),
        O.isSome
      )
    ),
  cvv: z
    .string()
    .length(3)
    .refine((val) => !isNaN(parseInt(val)))
    .transform((val) => Math.abs(parseInt(val))),
  exp: z
    .string()
    .min(1)
    .refine((val) => O.isSome(expirationDate(val as NonEmptyString))),
  circuit: z.literal("Mastercard").or(z.literal("Visa")),
});

export type CardsAddSchema = z.infer<typeof cardsAddSchema>;

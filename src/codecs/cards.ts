import * as iots from "io-ts";
import { NonEmptyString } from "io-ts-types";

export const cards = iots.readonlyArray(
  iots.type({
    cardNumber: NonEmptyString,
    circuit: iots.union([
      iots.literal("Mastercard"),
      iots.literal("Visa"),
      iots.literal("American Express"),
    ]),
    exp: NonEmptyString,
    cvv: iots.number,
    id: iots.number,
  })
);

export type Cards = iots.TypeOf<typeof cards>;

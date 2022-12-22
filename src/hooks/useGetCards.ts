import { useQuery } from "@tanstack/react-query";
import { identity, pipe } from "fp-ts/function";
import { useRemoteData } from "./useRemoteData";
import * as RD from "@devexperts/remote-data-ts";
import * as RA from "fp-ts/ReadonlyArray";
import { Cards, cards } from "../codecs/cards";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { validateCard, ValidatedCard } from "../utils/validateCard";
import * as D from "fp-ts/Date";
import * as Ord from "fp-ts/Ord";
import { contramap } from "fp-ts/Ord";

export const getCardsData = async (options?: RequestInit) =>
  await fetch(`http://localhost:3000/cardsData`, options)
    .then((_) => _.json())
    .then((res) =>
      pipe(
        res,
        cards.decode,
        E.matchW(() => {
          throw new Error("No valid format provided for this request");
        }, identity)
      )
    )
    .catch((e) => e);

const ByDate = pipe(
  D.Ord,
  Ord.reverse,
  contramap((cards: ValidatedCard) => cards.exp)
);

export const useGetCards = () => {
  const requestCards = useQuery<Cards>({
    queryKey: ["cardsData"],
    queryFn: getCardsData,
  });

  const paginatedCardsRemote = useRemoteData(requestCards);

  return pipe(
    paginatedCardsRemote,
    RD.map((cards) =>
      pipe(
        cards,
        RA.map((cards) => validateCard(cards)),
        RA.filter(O.isSome),
        RA.map(({ value }) => value),
        RA.sort(ByDate)
      )
    )
  );
};

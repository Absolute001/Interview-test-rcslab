/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { css, SerializedStyles } from "@emotion/react";
import { match } from "ts-pattern";
import { FC } from "react";
import { ReactComponent as MastercardLogo } from "../components/assets/m-c.svg";
import { ReactComponent as VisaLogo } from "../components/assets/visa.svg";
import { ValidatedCard } from "../utils/validateCard";
import { pipe } from "fp-ts/function";
import { format } from "date-fns";

type Props = Pick<ValidatedCard, "cardNumber" | "circuit" | "exp"> & {
  containerStyles?: SerializedStyles;
};

const Container = styled.div<{ circuit: Props["circuit"] }>`
  display: grid;
  grid-template-areas:
    "circuit circuit"
    "number logo"
    "exp logo";
  grid-template-columns: 70% 30%;
  grid-template-rows: 2fr 1fr 1fr;
  height: 8rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  grid-column: 1/13;
  padding: 1.25rem;
  ${({ circuit }) =>
    match(circuit)
      .with(
        "Mastercard",
        () =>
          css`
            background: linear-gradient(120deg, #253646, #43505f);
            color: white;
          `
      )
      .with(
        "Visa",
        () => css`
          background: linear-gradient(120deg, #004793, #0051a0);
          color: white;
        `
      )
      .exhaustive()}
  p {
    margin: 0;
  }
`;

const Circuit = styled.p`
  grid-area: circuit;
  font-size: 2rem;
`;

const CardNumber = styled.p`
  grid-area: number;
`;

const ExpDate = styled.div`
  grid-area: exp;
`;

const Logo = styled.div`
  grid-area: logo;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  svg {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const Card: FC<Props> = ({
  circuit,
  exp,
  containerStyles,
  cardNumber,
}) => {
  return (
    <Container css={containerStyles} circuit={circuit}>
      <Circuit>{circuit}</Circuit>
      <CardNumber>{cardNumber}</CardNumber>
      <ExpDate>
        <p>VALID THRU:</p>
        <p>{pipe(format(exp, "L/yy"))}</p>
      </ExpDate>
      <Logo>
        {match(circuit)
          .with("Mastercard", () => <MastercardLogo />)
          .with("Visa", () => (
            <VisaLogo
              css={css`
                background-color: white;
              `}
            />
          ))
          .exhaustive()}
      </Logo>
    </Container>
  );
};

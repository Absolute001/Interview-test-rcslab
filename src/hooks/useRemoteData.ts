import { RemoteData } from "@devexperts/remote-data-ts";
import { QueryStatus } from "@tanstack/react-query";
import { match } from "ts-pattern";
import * as RD from "@devexperts/remote-data-ts";

interface Query<T> {
  data: T | undefined;
  status: QueryStatus;
  error: unknown;
}

export const useRemoteData = <T>(query: Query<T>): RemoteData<unknown, T> =>
  match(query)
    .with({ status: "success" }, ({ data }) =>
      data ? RD.success(data) : RD.failure("impossible state")
    )
    .with({ status: "error" }, ({ error }) => RD.failure(error))
    .with({ status: "loading" }, () => RD.pending)
    .exhaustive();

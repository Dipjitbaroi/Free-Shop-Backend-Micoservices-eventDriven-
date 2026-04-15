
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Vendor
 * 
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>
/**
 * Model VendorDocument
 * 
 */
export type VendorDocument = $Result.DefaultSelection<Prisma.$VendorDocumentPayload>
/**
 * Model Commission
 * 
 */
export type Commission = $Result.DefaultSelection<Prisma.$CommissionPayload>
/**
 * Model Withdrawal
 * 
 */
export type Withdrawal = $Result.DefaultSelection<Prisma.$WithdrawalPayload>
/**
 * Model VendorReview
 * 
 */
export type VendorReview = $Result.DefaultSelection<Prisma.$VendorReviewPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const VendorStatus: {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  CLOSED: 'CLOSED'
};

export type VendorStatus = (typeof VendorStatus)[keyof typeof VendorStatus]


export const VerificationStatus: {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus]


export const DocumentType: {
  NID: 'NID',
  TRADE_LICENSE: 'TRADE_LICENSE',
  TIN_CERTIFICATE: 'TIN_CERTIFICATE',
  BANK_STATEMENT: 'BANK_STATEMENT',
  UTILITY_BILL: 'UTILITY_BILL',
  OTHER: 'OTHER'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const DocumentStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]


export const CommissionStatus: {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  WITHDRAWN: 'WITHDRAWN',
  CANCELLED: 'CANCELLED'
};

export type CommissionStatus = (typeof CommissionStatus)[keyof typeof CommissionStatus]


export const WithdrawalMethod: {
  BANK_TRANSFER: 'BANK_TRANSFER',
  BKASH: 'BKASH',
  NAGAD: 'NAGAD',
  ROCKET: 'ROCKET'
};

export type WithdrawalMethod = (typeof WithdrawalMethod)[keyof typeof WithdrawalMethod]


export const WithdrawalStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED'
};

export type WithdrawalStatus = (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus]

}

export type VendorStatus = $Enums.VendorStatus

export const VendorStatus: typeof $Enums.VendorStatus

export type VerificationStatus = $Enums.VerificationStatus

export const VerificationStatus: typeof $Enums.VerificationStatus

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type DocumentStatus = $Enums.DocumentStatus

export const DocumentStatus: typeof $Enums.DocumentStatus

export type CommissionStatus = $Enums.CommissionStatus

export const CommissionStatus: typeof $Enums.CommissionStatus

export type WithdrawalMethod = $Enums.WithdrawalMethod

export const WithdrawalMethod: typeof $Enums.WithdrawalMethod

export type WithdrawalStatus = $Enums.WithdrawalStatus

export const WithdrawalStatus: typeof $Enums.WithdrawalStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Vendors
 * const vendors = await prisma.vendor.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Vendors
   * const vendors = await prisma.vendor.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendors
    * const vendors = await prisma.vendor.findMany()
    * ```
    */
  get vendor(): Prisma.VendorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vendorDocument`: Exposes CRUD operations for the **VendorDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VendorDocuments
    * const vendorDocuments = await prisma.vendorDocument.findMany()
    * ```
    */
  get vendorDocument(): Prisma.VendorDocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.commission`: Exposes CRUD operations for the **Commission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Commissions
    * const commissions = await prisma.commission.findMany()
    * ```
    */
  get commission(): Prisma.CommissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.withdrawal`: Exposes CRUD operations for the **Withdrawal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Withdrawals
    * const withdrawals = await prisma.withdrawal.findMany()
    * ```
    */
  get withdrawal(): Prisma.WithdrawalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vendorReview`: Exposes CRUD operations for the **VendorReview** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VendorReviews
    * const vendorReviews = await prisma.vendorReview.findMany()
    * ```
    */
  get vendorReview(): Prisma.VendorReviewDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Vendor: 'Vendor',
    VendorDocument: 'VendorDocument',
    Commission: 'Commission',
    Withdrawal: 'Withdrawal',
    VendorReview: 'VendorReview'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "vendor" | "vendorDocument" | "commission" | "withdrawal" | "vendorReview"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>
        fields: Prisma.VendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VendorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendor>
          }
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>
            result: $Utils.Optional<VendorCountAggregateOutputType> | number
          }
        }
      }
      VendorDocument: {
        payload: Prisma.$VendorDocumentPayload<ExtArgs>
        fields: Prisma.VendorDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>
          }
          findFirst: {
            args: Prisma.VendorDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>
          }
          findMany: {
            args: Prisma.VendorDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>[]
          }
          create: {
            args: Prisma.VendorDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>
          }
          createMany: {
            args: Prisma.VendorDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>[]
          }
          delete: {
            args: Prisma.VendorDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>
          }
          update: {
            args: Prisma.VendorDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>
          }
          deleteMany: {
            args: Prisma.VendorDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VendorDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>[]
          }
          upsert: {
            args: Prisma.VendorDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorDocumentPayload>
          }
          aggregate: {
            args: Prisma.VendorDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendorDocument>
          }
          groupBy: {
            args: Prisma.VendorDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<VendorDocumentCountAggregateOutputType> | number
          }
        }
      }
      Commission: {
        payload: Prisma.$CommissionPayload<ExtArgs>
        fields: Prisma.CommissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>
          }
          findFirst: {
            args: Prisma.CommissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>
          }
          findMany: {
            args: Prisma.CommissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>[]
          }
          create: {
            args: Prisma.CommissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>
          }
          createMany: {
            args: Prisma.CommissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>[]
          }
          delete: {
            args: Prisma.CommissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>
          }
          update: {
            args: Prisma.CommissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>
          }
          deleteMany: {
            args: Prisma.CommissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>[]
          }
          upsert: {
            args: Prisma.CommissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommissionPayload>
          }
          aggregate: {
            args: Prisma.CommissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommission>
          }
          groupBy: {
            args: Prisma.CommissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommissionCountArgs<ExtArgs>
            result: $Utils.Optional<CommissionCountAggregateOutputType> | number
          }
        }
      }
      Withdrawal: {
        payload: Prisma.$WithdrawalPayload<ExtArgs>
        fields: Prisma.WithdrawalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WithdrawalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WithdrawalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>
          }
          findFirst: {
            args: Prisma.WithdrawalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WithdrawalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>
          }
          findMany: {
            args: Prisma.WithdrawalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>[]
          }
          create: {
            args: Prisma.WithdrawalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>
          }
          createMany: {
            args: Prisma.WithdrawalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WithdrawalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>[]
          }
          delete: {
            args: Prisma.WithdrawalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>
          }
          update: {
            args: Prisma.WithdrawalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>
          }
          deleteMany: {
            args: Prisma.WithdrawalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WithdrawalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WithdrawalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>[]
          }
          upsert: {
            args: Prisma.WithdrawalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WithdrawalPayload>
          }
          aggregate: {
            args: Prisma.WithdrawalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWithdrawal>
          }
          groupBy: {
            args: Prisma.WithdrawalGroupByArgs<ExtArgs>
            result: $Utils.Optional<WithdrawalGroupByOutputType>[]
          }
          count: {
            args: Prisma.WithdrawalCountArgs<ExtArgs>
            result: $Utils.Optional<WithdrawalCountAggregateOutputType> | number
          }
        }
      }
      VendorReview: {
        payload: Prisma.$VendorReviewPayload<ExtArgs>
        fields: Prisma.VendorReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>
          }
          findFirst: {
            args: Prisma.VendorReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>
          }
          findMany: {
            args: Prisma.VendorReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>[]
          }
          create: {
            args: Prisma.VendorReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>
          }
          createMany: {
            args: Prisma.VendorReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>[]
          }
          delete: {
            args: Prisma.VendorReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>
          }
          update: {
            args: Prisma.VendorReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>
          }
          deleteMany: {
            args: Prisma.VendorReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VendorReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>[]
          }
          upsert: {
            args: Prisma.VendorReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReviewPayload>
          }
          aggregate: {
            args: Prisma.VendorReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendorReview>
          }
          groupBy: {
            args: Prisma.VendorReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorReviewCountArgs<ExtArgs>
            result: $Utils.Optional<VendorReviewCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    vendor?: VendorOmit
    vendorDocument?: VendorDocumentOmit
    commission?: CommissionOmit
    withdrawal?: WithdrawalOmit
    vendorReview?: VendorReviewOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    documents: number
    commissions: number
    withdrawals: number
    reviews: number
  }

  export type VendorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | VendorCountOutputTypeCountDocumentsArgs
    commissions?: boolean | VendorCountOutputTypeCountCommissionsArgs
    withdrawals?: boolean | VendorCountOutputTypeCountWithdrawalsArgs
    reviews?: boolean | VendorCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorDocumentWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountCommissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommissionWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountWithdrawalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WithdrawalWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorReviewWhereInput
  }


  /**
   * Count Type WithdrawalCountOutputType
   */

  export type WithdrawalCountOutputType = {
    commissions: number
  }

  export type WithdrawalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commissions?: boolean | WithdrawalCountOutputTypeCountCommissionsArgs
  }

  // Custom InputTypes
  /**
   * WithdrawalCountOutputType without action
   */
  export type WithdrawalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalCountOutputType
     */
    select?: WithdrawalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WithdrawalCountOutputType without action
   */
  export type WithdrawalCountOutputTypeCountCommissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommissionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null
    _avg: VendorAvgAggregateOutputType | null
    _sum: VendorSumAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  export type VendorAvgAggregateOutputType = {
    rating: number | null
    totalReviews: number | null
    totalProducts: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    commissionRate: Decimal | null
    minimumWithdrawal: Decimal | null
  }

  export type VendorSumAggregateOutputType = {
    rating: number | null
    totalReviews: number | null
    totalProducts: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    commissionRate: Decimal | null
    minimumWithdrawal: Decimal | null
  }

  export type VendorMinAggregateOutputType = {
    id: string | null
    userId: string | null
    storeName: string | null
    storeSlug: string | null
    description: string | null
    logo: string | null
    banner: string | null
    contactEmail: string | null
    contactPhone: string | null
    status: $Enums.VendorStatus | null
    verificationStatus: $Enums.VerificationStatus | null
    verifiedAt: Date | null
    rejectionReason: string | null
    rating: number | null
    totalReviews: number | null
    totalProducts: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    commissionRate: Decimal | null
    minimumWithdrawal: Decimal | null
    returnPolicy: string | null
    shippingPolicy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    storeName: string | null
    storeSlug: string | null
    description: string | null
    logo: string | null
    banner: string | null
    contactEmail: string | null
    contactPhone: string | null
    status: $Enums.VendorStatus | null
    verificationStatus: $Enums.VerificationStatus | null
    verifiedAt: Date | null
    rejectionReason: string | null
    rating: number | null
    totalReviews: number | null
    totalProducts: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    commissionRate: Decimal | null
    minimumWithdrawal: Decimal | null
    returnPolicy: string | null
    shippingPolicy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorCountAggregateOutputType = {
    id: number
    userId: number
    storeName: number
    storeSlug: number
    description: number
    logo: number
    banner: number
    contactEmail: number
    contactPhone: number
    status: number
    verificationStatus: number
    verifiedAt: number
    rejectionReason: number
    rating: number
    totalReviews: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    commissionRate: number
    minimumWithdrawal: number
    businessAddress: number
    shippingZones: number
    returnPolicy: number
    shippingPolicy: number
    bankDetails: number
    mobileWallet: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VendorAvgAggregateInputType = {
    rating?: true
    totalReviews?: true
    totalProducts?: true
    totalOrders?: true
    totalRevenue?: true
    commissionRate?: true
    minimumWithdrawal?: true
  }

  export type VendorSumAggregateInputType = {
    rating?: true
    totalReviews?: true
    totalProducts?: true
    totalOrders?: true
    totalRevenue?: true
    commissionRate?: true
    minimumWithdrawal?: true
  }

  export type VendorMinAggregateInputType = {
    id?: true
    userId?: true
    storeName?: true
    storeSlug?: true
    description?: true
    logo?: true
    banner?: true
    contactEmail?: true
    contactPhone?: true
    status?: true
    verificationStatus?: true
    verifiedAt?: true
    rejectionReason?: true
    rating?: true
    totalReviews?: true
    totalProducts?: true
    totalOrders?: true
    totalRevenue?: true
    commissionRate?: true
    minimumWithdrawal?: true
    returnPolicy?: true
    shippingPolicy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorMaxAggregateInputType = {
    id?: true
    userId?: true
    storeName?: true
    storeSlug?: true
    description?: true
    logo?: true
    banner?: true
    contactEmail?: true
    contactPhone?: true
    status?: true
    verificationStatus?: true
    verifiedAt?: true
    rejectionReason?: true
    rating?: true
    totalReviews?: true
    totalProducts?: true
    totalOrders?: true
    totalRevenue?: true
    commissionRate?: true
    minimumWithdrawal?: true
    returnPolicy?: true
    shippingPolicy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorCountAggregateInputType = {
    id?: true
    userId?: true
    storeName?: true
    storeSlug?: true
    description?: true
    logo?: true
    banner?: true
    contactEmail?: true
    contactPhone?: true
    status?: true
    verificationStatus?: true
    verifiedAt?: true
    rejectionReason?: true
    rating?: true
    totalReviews?: true
    totalProducts?: true
    totalOrders?: true
    totalRevenue?: true
    commissionRate?: true
    minimumWithdrawal?: true
    businessAddress?: true
    shippingZones?: true
    returnPolicy?: true
    shippingPolicy?: true
    bankDetails?: true
    mobileWallet?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vendors
    **/
    _count?: true | VendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VendorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VendorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorMaxAggregateInputType
  }

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>
  }




  export type VendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithAggregationInput | VendorOrderByWithAggregationInput[]
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum
    having?: VendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorCountAggregateInputType | true
    _avg?: VendorAvgAggregateInputType
    _sum?: VendorSumAggregateInputType
    _min?: VendorMinAggregateInputType
    _max?: VendorMaxAggregateInputType
  }

  export type VendorGroupByOutputType = {
    id: string
    userId: string
    storeName: string
    storeSlug: string
    description: string | null
    logo: string | null
    banner: string | null
    contactEmail: string
    contactPhone: string | null
    status: $Enums.VendorStatus
    verificationStatus: $Enums.VerificationStatus
    verifiedAt: Date | null
    rejectionReason: string | null
    rating: number
    totalReviews: number
    totalProducts: number
    totalOrders: number
    totalRevenue: Decimal
    commissionRate: Decimal
    minimumWithdrawal: Decimal
    businessAddress: JsonValue | null
    shippingZones: string[]
    returnPolicy: string | null
    shippingPolicy: string | null
    bankDetails: JsonValue | null
    mobileWallet: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: VendorCountAggregateOutputType | null
    _avg: VendorAvgAggregateOutputType | null
    _sum: VendorSumAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>
        }
      >
    >


  export type VendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storeName?: boolean
    storeSlug?: boolean
    description?: boolean
    logo?: boolean
    banner?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    verificationStatus?: boolean
    verifiedAt?: boolean
    rejectionReason?: boolean
    rating?: boolean
    totalReviews?: boolean
    totalProducts?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    commissionRate?: boolean
    minimumWithdrawal?: boolean
    businessAddress?: boolean
    shippingZones?: boolean
    returnPolicy?: boolean
    shippingPolicy?: boolean
    bankDetails?: boolean
    mobileWallet?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    documents?: boolean | Vendor$documentsArgs<ExtArgs>
    commissions?: boolean | Vendor$commissionsArgs<ExtArgs>
    withdrawals?: boolean | Vendor$withdrawalsArgs<ExtArgs>
    reviews?: boolean | Vendor$reviewsArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storeName?: boolean
    storeSlug?: boolean
    description?: boolean
    logo?: boolean
    banner?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    verificationStatus?: boolean
    verifiedAt?: boolean
    rejectionReason?: boolean
    rating?: boolean
    totalReviews?: boolean
    totalProducts?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    commissionRate?: boolean
    minimumWithdrawal?: boolean
    businessAddress?: boolean
    shippingZones?: boolean
    returnPolicy?: boolean
    shippingPolicy?: boolean
    bankDetails?: boolean
    mobileWallet?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storeName?: boolean
    storeSlug?: boolean
    description?: boolean
    logo?: boolean
    banner?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    verificationStatus?: boolean
    verifiedAt?: boolean
    rejectionReason?: boolean
    rating?: boolean
    totalReviews?: boolean
    totalProducts?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    commissionRate?: boolean
    minimumWithdrawal?: boolean
    businessAddress?: boolean
    shippingZones?: boolean
    returnPolicy?: boolean
    shippingPolicy?: boolean
    bankDetails?: boolean
    mobileWallet?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectScalar = {
    id?: boolean
    userId?: boolean
    storeName?: boolean
    storeSlug?: boolean
    description?: boolean
    logo?: boolean
    banner?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    verificationStatus?: boolean
    verifiedAt?: boolean
    rejectionReason?: boolean
    rating?: boolean
    totalReviews?: boolean
    totalProducts?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    commissionRate?: boolean
    minimumWithdrawal?: boolean
    businessAddress?: boolean
    shippingZones?: boolean
    returnPolicy?: boolean
    shippingPolicy?: boolean
    bankDetails?: boolean
    mobileWallet?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VendorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "storeName" | "storeSlug" | "description" | "logo" | "banner" | "contactEmail" | "contactPhone" | "status" | "verificationStatus" | "verifiedAt" | "rejectionReason" | "rating" | "totalReviews" | "totalProducts" | "totalOrders" | "totalRevenue" | "commissionRate" | "minimumWithdrawal" | "businessAddress" | "shippingZones" | "returnPolicy" | "shippingPolicy" | "bankDetails" | "mobileWallet" | "createdAt" | "updatedAt", ExtArgs["result"]["vendor"]>
  export type VendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | Vendor$documentsArgs<ExtArgs>
    commissions?: boolean | Vendor$commissionsArgs<ExtArgs>
    withdrawals?: boolean | Vendor$withdrawalsArgs<ExtArgs>
    reviews?: boolean | Vendor$reviewsArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VendorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VendorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vendor"
    objects: {
      documents: Prisma.$VendorDocumentPayload<ExtArgs>[]
      commissions: Prisma.$CommissionPayload<ExtArgs>[]
      withdrawals: Prisma.$WithdrawalPayload<ExtArgs>[]
      reviews: Prisma.$VendorReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      storeName: string
      storeSlug: string
      description: string | null
      logo: string | null
      banner: string | null
      contactEmail: string
      contactPhone: string | null
      status: $Enums.VendorStatus
      verificationStatus: $Enums.VerificationStatus
      verifiedAt: Date | null
      rejectionReason: string | null
      rating: number
      totalReviews: number
      totalProducts: number
      totalOrders: number
      totalRevenue: Prisma.Decimal
      commissionRate: Prisma.Decimal
      minimumWithdrawal: Prisma.Decimal
      businessAddress: Prisma.JsonValue | null
      shippingZones: string[]
      returnPolicy: string | null
      shippingPolicy: string | null
      bankDetails: Prisma.JsonValue | null
      mobileWallet: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vendor"]>
    composites: {}
  }

  type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = $Result.GetResult<Prisma.$VendorPayload, S>

  type VendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorCountAggregateInputType | true
    }

  export interface VendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vendor'], meta: { name: 'Vendor' } }
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     * 
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorFindManyArgs>(args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     * 
     */
    create<T extends VendorCreateArgs>(args: SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorCreateManyArgs>(args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vendors and returns the data saved in the database.
     * @param {VendorCreateManyAndReturnArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     * 
     */
    delete<T extends VendorDeleteArgs>(args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorUpdateArgs>(args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDeleteManyArgs>(args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorUpdateManyArgs>(args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors and returns the data updated in the database.
     * @param {VendorUpdateManyAndReturnArgs} args - Arguments to update many Vendors.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VendorUpdateManyAndReturnArgs>(args: SelectSubset<T, VendorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
    **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorAggregateArgs>(args: Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vendor model
   */
  readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    documents<T extends Vendor$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    commissions<T extends Vendor$commissionsArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$commissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    withdrawals<T extends Vendor$withdrawalsArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$withdrawalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviews<T extends Vendor$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vendor model
   */
  interface VendorFieldRefs {
    readonly id: FieldRef<"Vendor", 'String'>
    readonly userId: FieldRef<"Vendor", 'String'>
    readonly storeName: FieldRef<"Vendor", 'String'>
    readonly storeSlug: FieldRef<"Vendor", 'String'>
    readonly description: FieldRef<"Vendor", 'String'>
    readonly logo: FieldRef<"Vendor", 'String'>
    readonly banner: FieldRef<"Vendor", 'String'>
    readonly contactEmail: FieldRef<"Vendor", 'String'>
    readonly contactPhone: FieldRef<"Vendor", 'String'>
    readonly status: FieldRef<"Vendor", 'VendorStatus'>
    readonly verificationStatus: FieldRef<"Vendor", 'VerificationStatus'>
    readonly verifiedAt: FieldRef<"Vendor", 'DateTime'>
    readonly rejectionReason: FieldRef<"Vendor", 'String'>
    readonly rating: FieldRef<"Vendor", 'Float'>
    readonly totalReviews: FieldRef<"Vendor", 'Int'>
    readonly totalProducts: FieldRef<"Vendor", 'Int'>
    readonly totalOrders: FieldRef<"Vendor", 'Int'>
    readonly totalRevenue: FieldRef<"Vendor", 'Decimal'>
    readonly commissionRate: FieldRef<"Vendor", 'Decimal'>
    readonly minimumWithdrawal: FieldRef<"Vendor", 'Decimal'>
    readonly businessAddress: FieldRef<"Vendor", 'Json'>
    readonly shippingZones: FieldRef<"Vendor", 'String[]'>
    readonly returnPolicy: FieldRef<"Vendor", 'String'>
    readonly shippingPolicy: FieldRef<"Vendor", 'String'>
    readonly bankDetails: FieldRef<"Vendor", 'Json'>
    readonly mobileWallet: FieldRef<"Vendor", 'Json'>
    readonly createdAt: FieldRef<"Vendor", 'DateTime'>
    readonly updatedAt: FieldRef<"Vendor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor create
   */
  export type VendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>
  }

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor createManyAndReturn
   */
  export type VendorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to update.
     */
    limit?: number
  }

  /**
   * Vendor updateManyAndReturn
   */
  export type VendorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to update.
     */
    limit?: number
  }

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
  }

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to delete.
     */
    limit?: number
  }

  /**
   * Vendor.documents
   */
  export type Vendor$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    where?: VendorDocumentWhereInput
    orderBy?: VendorDocumentOrderByWithRelationInput | VendorDocumentOrderByWithRelationInput[]
    cursor?: VendorDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VendorDocumentScalarFieldEnum | VendorDocumentScalarFieldEnum[]
  }

  /**
   * Vendor.commissions
   */
  export type Vendor$commissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    where?: CommissionWhereInput
    orderBy?: CommissionOrderByWithRelationInput | CommissionOrderByWithRelationInput[]
    cursor?: CommissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommissionScalarFieldEnum | CommissionScalarFieldEnum[]
  }

  /**
   * Vendor.withdrawals
   */
  export type Vendor$withdrawalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    where?: WithdrawalWhereInput
    orderBy?: WithdrawalOrderByWithRelationInput | WithdrawalOrderByWithRelationInput[]
    cursor?: WithdrawalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WithdrawalScalarFieldEnum | WithdrawalScalarFieldEnum[]
  }

  /**
   * Vendor.reviews
   */
  export type Vendor$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    where?: VendorReviewWhereInput
    orderBy?: VendorReviewOrderByWithRelationInput | VendorReviewOrderByWithRelationInput[]
    cursor?: VendorReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VendorReviewScalarFieldEnum | VendorReviewScalarFieldEnum[]
  }

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
  }


  /**
   * Model VendorDocument
   */

  export type AggregateVendorDocument = {
    _count: VendorDocumentCountAggregateOutputType | null
    _min: VendorDocumentMinAggregateOutputType | null
    _max: VendorDocumentMaxAggregateOutputType | null
  }

  export type VendorDocumentMinAggregateOutputType = {
    id: string | null
    vendorId: string | null
    type: $Enums.DocumentType | null
    documentUrl: string | null
    status: $Enums.DocumentStatus | null
    verifiedAt: Date | null
    rejectedAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorDocumentMaxAggregateOutputType = {
    id: string | null
    vendorId: string | null
    type: $Enums.DocumentType | null
    documentUrl: string | null
    status: $Enums.DocumentStatus | null
    verifiedAt: Date | null
    rejectedAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorDocumentCountAggregateOutputType = {
    id: number
    vendorId: number
    type: number
    documentUrl: number
    status: number
    verifiedAt: number
    rejectedAt: number
    rejectionReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VendorDocumentMinAggregateInputType = {
    id?: true
    vendorId?: true
    type?: true
    documentUrl?: true
    status?: true
    verifiedAt?: true
    rejectedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorDocumentMaxAggregateInputType = {
    id?: true
    vendorId?: true
    type?: true
    documentUrl?: true
    status?: true
    verifiedAt?: true
    rejectedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorDocumentCountAggregateInputType = {
    id?: true
    vendorId?: true
    type?: true
    documentUrl?: true
    status?: true
    verifiedAt?: true
    rejectedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VendorDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorDocument to aggregate.
     */
    where?: VendorDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorDocuments to fetch.
     */
    orderBy?: VendorDocumentOrderByWithRelationInput | VendorDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VendorDocuments
    **/
    _count?: true | VendorDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorDocumentMaxAggregateInputType
  }

  export type GetVendorDocumentAggregateType<T extends VendorDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateVendorDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendorDocument[P]>
      : GetScalarType<T[P], AggregateVendorDocument[P]>
  }




  export type VendorDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorDocumentWhereInput
    orderBy?: VendorDocumentOrderByWithAggregationInput | VendorDocumentOrderByWithAggregationInput[]
    by: VendorDocumentScalarFieldEnum[] | VendorDocumentScalarFieldEnum
    having?: VendorDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorDocumentCountAggregateInputType | true
    _min?: VendorDocumentMinAggregateInputType
    _max?: VendorDocumentMaxAggregateInputType
  }

  export type VendorDocumentGroupByOutputType = {
    id: string
    vendorId: string
    type: $Enums.DocumentType
    documentUrl: string
    status: $Enums.DocumentStatus
    verifiedAt: Date | null
    rejectedAt: Date | null
    rejectionReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: VendorDocumentCountAggregateOutputType | null
    _min: VendorDocumentMinAggregateOutputType | null
    _max: VendorDocumentMaxAggregateOutputType | null
  }

  type GetVendorDocumentGroupByPayload<T extends VendorDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], VendorDocumentGroupByOutputType[P]>
        }
      >
    >


  export type VendorDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    type?: boolean
    documentUrl?: boolean
    status?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorDocument"]>

  export type VendorDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    type?: boolean
    documentUrl?: boolean
    status?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorDocument"]>

  export type VendorDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    type?: boolean
    documentUrl?: boolean
    status?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorDocument"]>

  export type VendorDocumentSelectScalar = {
    id?: boolean
    vendorId?: boolean
    type?: boolean
    documentUrl?: boolean
    status?: boolean
    verifiedAt?: boolean
    rejectedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VendorDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vendorId" | "type" | "documentUrl" | "status" | "verifiedAt" | "rejectedAt" | "rejectionReason" | "createdAt" | "updatedAt", ExtArgs["result"]["vendorDocument"]>
  export type VendorDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }
  export type VendorDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }
  export type VendorDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }

  export type $VendorDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VendorDocument"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vendorId: string
      type: $Enums.DocumentType
      documentUrl: string
      status: $Enums.DocumentStatus
      verifiedAt: Date | null
      rejectedAt: Date | null
      rejectionReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vendorDocument"]>
    composites: {}
  }

  type VendorDocumentGetPayload<S extends boolean | null | undefined | VendorDocumentDefaultArgs> = $Result.GetResult<Prisma.$VendorDocumentPayload, S>

  type VendorDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorDocumentCountAggregateInputType | true
    }

  export interface VendorDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VendorDocument'], meta: { name: 'VendorDocument' } }
    /**
     * Find zero or one VendorDocument that matches the filter.
     * @param {VendorDocumentFindUniqueArgs} args - Arguments to find a VendorDocument
     * @example
     * // Get one VendorDocument
     * const vendorDocument = await prisma.vendorDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorDocumentFindUniqueArgs>(args: SelectSubset<T, VendorDocumentFindUniqueArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VendorDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorDocumentFindUniqueOrThrowArgs} args - Arguments to find a VendorDocument
     * @example
     * // Get one VendorDocument
     * const vendorDocument = await prisma.vendorDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VendorDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentFindFirstArgs} args - Arguments to find a VendorDocument
     * @example
     * // Get one VendorDocument
     * const vendorDocument = await prisma.vendorDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorDocumentFindFirstArgs>(args?: SelectSubset<T, VendorDocumentFindFirstArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VendorDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentFindFirstOrThrowArgs} args - Arguments to find a VendorDocument
     * @example
     * // Get one VendorDocument
     * const vendorDocument = await prisma.vendorDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VendorDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VendorDocuments
     * const vendorDocuments = await prisma.vendorDocument.findMany()
     * 
     * // Get first 10 VendorDocuments
     * const vendorDocuments = await prisma.vendorDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorDocumentWithIdOnly = await prisma.vendorDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorDocumentFindManyArgs>(args?: SelectSubset<T, VendorDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VendorDocument.
     * @param {VendorDocumentCreateArgs} args - Arguments to create a VendorDocument.
     * @example
     * // Create one VendorDocument
     * const VendorDocument = await prisma.vendorDocument.create({
     *   data: {
     *     // ... data to create a VendorDocument
     *   }
     * })
     * 
     */
    create<T extends VendorDocumentCreateArgs>(args: SelectSubset<T, VendorDocumentCreateArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VendorDocuments.
     * @param {VendorDocumentCreateManyArgs} args - Arguments to create many VendorDocuments.
     * @example
     * // Create many VendorDocuments
     * const vendorDocument = await prisma.vendorDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorDocumentCreateManyArgs>(args?: SelectSubset<T, VendorDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VendorDocuments and returns the data saved in the database.
     * @param {VendorDocumentCreateManyAndReturnArgs} args - Arguments to create many VendorDocuments.
     * @example
     * // Create many VendorDocuments
     * const vendorDocument = await prisma.vendorDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VendorDocuments and only return the `id`
     * const vendorDocumentWithIdOnly = await prisma.vendorDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VendorDocument.
     * @param {VendorDocumentDeleteArgs} args - Arguments to delete one VendorDocument.
     * @example
     * // Delete one VendorDocument
     * const VendorDocument = await prisma.vendorDocument.delete({
     *   where: {
     *     // ... filter to delete one VendorDocument
     *   }
     * })
     * 
     */
    delete<T extends VendorDocumentDeleteArgs>(args: SelectSubset<T, VendorDocumentDeleteArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VendorDocument.
     * @param {VendorDocumentUpdateArgs} args - Arguments to update one VendorDocument.
     * @example
     * // Update one VendorDocument
     * const vendorDocument = await prisma.vendorDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorDocumentUpdateArgs>(args: SelectSubset<T, VendorDocumentUpdateArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VendorDocuments.
     * @param {VendorDocumentDeleteManyArgs} args - Arguments to filter VendorDocuments to delete.
     * @example
     * // Delete a few VendorDocuments
     * const { count } = await prisma.vendorDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDocumentDeleteManyArgs>(args?: SelectSubset<T, VendorDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VendorDocuments
     * const vendorDocument = await prisma.vendorDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorDocumentUpdateManyArgs>(args: SelectSubset<T, VendorDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorDocuments and returns the data updated in the database.
     * @param {VendorDocumentUpdateManyAndReturnArgs} args - Arguments to update many VendorDocuments.
     * @example
     * // Update many VendorDocuments
     * const vendorDocument = await prisma.vendorDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VendorDocuments and only return the `id`
     * const vendorDocumentWithIdOnly = await prisma.vendorDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VendorDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, VendorDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VendorDocument.
     * @param {VendorDocumentUpsertArgs} args - Arguments to update or create a VendorDocument.
     * @example
     * // Update or create a VendorDocument
     * const vendorDocument = await prisma.vendorDocument.upsert({
     *   create: {
     *     // ... data to create a VendorDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VendorDocument we want to update
     *   }
     * })
     */
    upsert<T extends VendorDocumentUpsertArgs>(args: SelectSubset<T, VendorDocumentUpsertArgs<ExtArgs>>): Prisma__VendorDocumentClient<$Result.GetResult<Prisma.$VendorDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VendorDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentCountArgs} args - Arguments to filter VendorDocuments to count.
     * @example
     * // Count the number of VendorDocuments
     * const count = await prisma.vendorDocument.count({
     *   where: {
     *     // ... the filter for the VendorDocuments we want to count
     *   }
     * })
    **/
    count<T extends VendorDocumentCountArgs>(
      args?: Subset<T, VendorDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VendorDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorDocumentAggregateArgs>(args: Subset<T, VendorDocumentAggregateArgs>): Prisma.PrismaPromise<GetVendorDocumentAggregateType<T>>

    /**
     * Group by VendorDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorDocumentGroupByArgs['orderBy'] }
        : { orderBy?: VendorDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VendorDocument model
   */
  readonly fields: VendorDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VendorDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VendorDocument model
   */
  interface VendorDocumentFieldRefs {
    readonly id: FieldRef<"VendorDocument", 'String'>
    readonly vendorId: FieldRef<"VendorDocument", 'String'>
    readonly type: FieldRef<"VendorDocument", 'DocumentType'>
    readonly documentUrl: FieldRef<"VendorDocument", 'String'>
    readonly status: FieldRef<"VendorDocument", 'DocumentStatus'>
    readonly verifiedAt: FieldRef<"VendorDocument", 'DateTime'>
    readonly rejectedAt: FieldRef<"VendorDocument", 'DateTime'>
    readonly rejectionReason: FieldRef<"VendorDocument", 'String'>
    readonly createdAt: FieldRef<"VendorDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"VendorDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VendorDocument findUnique
   */
  export type VendorDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * Filter, which VendorDocument to fetch.
     */
    where: VendorDocumentWhereUniqueInput
  }

  /**
   * VendorDocument findUniqueOrThrow
   */
  export type VendorDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * Filter, which VendorDocument to fetch.
     */
    where: VendorDocumentWhereUniqueInput
  }

  /**
   * VendorDocument findFirst
   */
  export type VendorDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * Filter, which VendorDocument to fetch.
     */
    where?: VendorDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorDocuments to fetch.
     */
    orderBy?: VendorDocumentOrderByWithRelationInput | VendorDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorDocuments.
     */
    cursor?: VendorDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorDocuments.
     */
    distinct?: VendorDocumentScalarFieldEnum | VendorDocumentScalarFieldEnum[]
  }

  /**
   * VendorDocument findFirstOrThrow
   */
  export type VendorDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * Filter, which VendorDocument to fetch.
     */
    where?: VendorDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorDocuments to fetch.
     */
    orderBy?: VendorDocumentOrderByWithRelationInput | VendorDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorDocuments.
     */
    cursor?: VendorDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorDocuments.
     */
    distinct?: VendorDocumentScalarFieldEnum | VendorDocumentScalarFieldEnum[]
  }

  /**
   * VendorDocument findMany
   */
  export type VendorDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * Filter, which VendorDocuments to fetch.
     */
    where?: VendorDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorDocuments to fetch.
     */
    orderBy?: VendorDocumentOrderByWithRelationInput | VendorDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VendorDocuments.
     */
    cursor?: VendorDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorDocuments.
     */
    distinct?: VendorDocumentScalarFieldEnum | VendorDocumentScalarFieldEnum[]
  }

  /**
   * VendorDocument create
   */
  export type VendorDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a VendorDocument.
     */
    data: XOR<VendorDocumentCreateInput, VendorDocumentUncheckedCreateInput>
  }

  /**
   * VendorDocument createMany
   */
  export type VendorDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VendorDocuments.
     */
    data: VendorDocumentCreateManyInput | VendorDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VendorDocument createManyAndReturn
   */
  export type VendorDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many VendorDocuments.
     */
    data: VendorDocumentCreateManyInput | VendorDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VendorDocument update
   */
  export type VendorDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a VendorDocument.
     */
    data: XOR<VendorDocumentUpdateInput, VendorDocumentUncheckedUpdateInput>
    /**
     * Choose, which VendorDocument to update.
     */
    where: VendorDocumentWhereUniqueInput
  }

  /**
   * VendorDocument updateMany
   */
  export type VendorDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VendorDocuments.
     */
    data: XOR<VendorDocumentUpdateManyMutationInput, VendorDocumentUncheckedUpdateManyInput>
    /**
     * Filter which VendorDocuments to update
     */
    where?: VendorDocumentWhereInput
    /**
     * Limit how many VendorDocuments to update.
     */
    limit?: number
  }

  /**
   * VendorDocument updateManyAndReturn
   */
  export type VendorDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * The data used to update VendorDocuments.
     */
    data: XOR<VendorDocumentUpdateManyMutationInput, VendorDocumentUncheckedUpdateManyInput>
    /**
     * Filter which VendorDocuments to update
     */
    where?: VendorDocumentWhereInput
    /**
     * Limit how many VendorDocuments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VendorDocument upsert
   */
  export type VendorDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the VendorDocument to update in case it exists.
     */
    where: VendorDocumentWhereUniqueInput
    /**
     * In case the VendorDocument found by the `where` argument doesn't exist, create a new VendorDocument with this data.
     */
    create: XOR<VendorDocumentCreateInput, VendorDocumentUncheckedCreateInput>
    /**
     * In case the VendorDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorDocumentUpdateInput, VendorDocumentUncheckedUpdateInput>
  }

  /**
   * VendorDocument delete
   */
  export type VendorDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
    /**
     * Filter which VendorDocument to delete.
     */
    where: VendorDocumentWhereUniqueInput
  }

  /**
   * VendorDocument deleteMany
   */
  export type VendorDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorDocuments to delete
     */
    where?: VendorDocumentWhereInput
    /**
     * Limit how many VendorDocuments to delete.
     */
    limit?: number
  }

  /**
   * VendorDocument without action
   */
  export type VendorDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorDocument
     */
    select?: VendorDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorDocument
     */
    omit?: VendorDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorDocumentInclude<ExtArgs> | null
  }


  /**
   * Model Commission
   */

  export type AggregateCommission = {
    _count: CommissionCountAggregateOutputType | null
    _avg: CommissionAvgAggregateOutputType | null
    _sum: CommissionSumAggregateOutputType | null
    _min: CommissionMinAggregateOutputType | null
    _max: CommissionMaxAggregateOutputType | null
  }

  export type CommissionAvgAggregateOutputType = {
    orderAmount: Decimal | null
    commissionRate: Decimal | null
    commissionAmount: Decimal | null
    netAmount: Decimal | null
  }

  export type CommissionSumAggregateOutputType = {
    orderAmount: Decimal | null
    commissionRate: Decimal | null
    commissionAmount: Decimal | null
    netAmount: Decimal | null
  }

  export type CommissionMinAggregateOutputType = {
    id: string | null
    vendorId: string | null
    orderId: string | null
    orderItemId: string | null
    productId: string | null
    orderAmount: Decimal | null
    commissionRate: Decimal | null
    commissionAmount: Decimal | null
    netAmount: Decimal | null
    status: $Enums.CommissionStatus | null
    settledAt: Date | null
    withdrawalId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommissionMaxAggregateOutputType = {
    id: string | null
    vendorId: string | null
    orderId: string | null
    orderItemId: string | null
    productId: string | null
    orderAmount: Decimal | null
    commissionRate: Decimal | null
    commissionAmount: Decimal | null
    netAmount: Decimal | null
    status: $Enums.CommissionStatus | null
    settledAt: Date | null
    withdrawalId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommissionCountAggregateOutputType = {
    id: number
    vendorId: number
    orderId: number
    orderItemId: number
    productId: number
    orderAmount: number
    commissionRate: number
    commissionAmount: number
    netAmount: number
    status: number
    settledAt: number
    withdrawalId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommissionAvgAggregateInputType = {
    orderAmount?: true
    commissionRate?: true
    commissionAmount?: true
    netAmount?: true
  }

  export type CommissionSumAggregateInputType = {
    orderAmount?: true
    commissionRate?: true
    commissionAmount?: true
    netAmount?: true
  }

  export type CommissionMinAggregateInputType = {
    id?: true
    vendorId?: true
    orderId?: true
    orderItemId?: true
    productId?: true
    orderAmount?: true
    commissionRate?: true
    commissionAmount?: true
    netAmount?: true
    status?: true
    settledAt?: true
    withdrawalId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommissionMaxAggregateInputType = {
    id?: true
    vendorId?: true
    orderId?: true
    orderItemId?: true
    productId?: true
    orderAmount?: true
    commissionRate?: true
    commissionAmount?: true
    netAmount?: true
    status?: true
    settledAt?: true
    withdrawalId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommissionCountAggregateInputType = {
    id?: true
    vendorId?: true
    orderId?: true
    orderItemId?: true
    productId?: true
    orderAmount?: true
    commissionRate?: true
    commissionAmount?: true
    netAmount?: true
    status?: true
    settledAt?: true
    withdrawalId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commission to aggregate.
     */
    where?: CommissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commissions to fetch.
     */
    orderBy?: CommissionOrderByWithRelationInput | CommissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Commissions
    **/
    _count?: true | CommissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommissionMaxAggregateInputType
  }

  export type GetCommissionAggregateType<T extends CommissionAggregateArgs> = {
        [P in keyof T & keyof AggregateCommission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommission[P]>
      : GetScalarType<T[P], AggregateCommission[P]>
  }




  export type CommissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommissionWhereInput
    orderBy?: CommissionOrderByWithAggregationInput | CommissionOrderByWithAggregationInput[]
    by: CommissionScalarFieldEnum[] | CommissionScalarFieldEnum
    having?: CommissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommissionCountAggregateInputType | true
    _avg?: CommissionAvgAggregateInputType
    _sum?: CommissionSumAggregateInputType
    _min?: CommissionMinAggregateInputType
    _max?: CommissionMaxAggregateInputType
  }

  export type CommissionGroupByOutputType = {
    id: string
    vendorId: string
    orderId: string
    orderItemId: string | null
    productId: string
    orderAmount: Decimal
    commissionRate: Decimal
    commissionAmount: Decimal
    netAmount: Decimal
    status: $Enums.CommissionStatus
    settledAt: Date | null
    withdrawalId: string | null
    createdAt: Date
    updatedAt: Date
    _count: CommissionCountAggregateOutputType | null
    _avg: CommissionAvgAggregateOutputType | null
    _sum: CommissionSumAggregateOutputType | null
    _min: CommissionMinAggregateOutputType | null
    _max: CommissionMaxAggregateOutputType | null
  }

  type GetCommissionGroupByPayload<T extends CommissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommissionGroupByOutputType[P]>
            : GetScalarType<T[P], CommissionGroupByOutputType[P]>
        }
      >
    >


  export type CommissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    orderId?: boolean
    orderItemId?: boolean
    productId?: boolean
    orderAmount?: boolean
    commissionRate?: boolean
    commissionAmount?: boolean
    netAmount?: boolean
    status?: boolean
    settledAt?: boolean
    withdrawalId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    withdrawal?: boolean | Commission$withdrawalArgs<ExtArgs>
  }, ExtArgs["result"]["commission"]>

  export type CommissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    orderId?: boolean
    orderItemId?: boolean
    productId?: boolean
    orderAmount?: boolean
    commissionRate?: boolean
    commissionAmount?: boolean
    netAmount?: boolean
    status?: boolean
    settledAt?: boolean
    withdrawalId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    withdrawal?: boolean | Commission$withdrawalArgs<ExtArgs>
  }, ExtArgs["result"]["commission"]>

  export type CommissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    orderId?: boolean
    orderItemId?: boolean
    productId?: boolean
    orderAmount?: boolean
    commissionRate?: boolean
    commissionAmount?: boolean
    netAmount?: boolean
    status?: boolean
    settledAt?: boolean
    withdrawalId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    withdrawal?: boolean | Commission$withdrawalArgs<ExtArgs>
  }, ExtArgs["result"]["commission"]>

  export type CommissionSelectScalar = {
    id?: boolean
    vendorId?: boolean
    orderId?: boolean
    orderItemId?: boolean
    productId?: boolean
    orderAmount?: boolean
    commissionRate?: boolean
    commissionAmount?: boolean
    netAmount?: boolean
    status?: boolean
    settledAt?: boolean
    withdrawalId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CommissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vendorId" | "orderId" | "orderItemId" | "productId" | "orderAmount" | "commissionRate" | "commissionAmount" | "netAmount" | "status" | "settledAt" | "withdrawalId" | "createdAt" | "updatedAt", ExtArgs["result"]["commission"]>
  export type CommissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    withdrawal?: boolean | Commission$withdrawalArgs<ExtArgs>
  }
  export type CommissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    withdrawal?: boolean | Commission$withdrawalArgs<ExtArgs>
  }
  export type CommissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    withdrawal?: boolean | Commission$withdrawalArgs<ExtArgs>
  }

  export type $CommissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Commission"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
      withdrawal: Prisma.$WithdrawalPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vendorId: string
      orderId: string
      orderItemId: string | null
      productId: string
      orderAmount: Prisma.Decimal
      commissionRate: Prisma.Decimal
      commissionAmount: Prisma.Decimal
      netAmount: Prisma.Decimal
      status: $Enums.CommissionStatus
      settledAt: Date | null
      withdrawalId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["commission"]>
    composites: {}
  }

  type CommissionGetPayload<S extends boolean | null | undefined | CommissionDefaultArgs> = $Result.GetResult<Prisma.$CommissionPayload, S>

  type CommissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommissionCountAggregateInputType | true
    }

  export interface CommissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Commission'], meta: { name: 'Commission' } }
    /**
     * Find zero or one Commission that matches the filter.
     * @param {CommissionFindUniqueArgs} args - Arguments to find a Commission
     * @example
     * // Get one Commission
     * const commission = await prisma.commission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommissionFindUniqueArgs>(args: SelectSubset<T, CommissionFindUniqueArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Commission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommissionFindUniqueOrThrowArgs} args - Arguments to find a Commission
     * @example
     * // Get one Commission
     * const commission = await prisma.commission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommissionFindUniqueOrThrowArgs>(args: SelectSubset<T, CommissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Commission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionFindFirstArgs} args - Arguments to find a Commission
     * @example
     * // Get one Commission
     * const commission = await prisma.commission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommissionFindFirstArgs>(args?: SelectSubset<T, CommissionFindFirstArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Commission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionFindFirstOrThrowArgs} args - Arguments to find a Commission
     * @example
     * // Get one Commission
     * const commission = await prisma.commission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommissionFindFirstOrThrowArgs>(args?: SelectSubset<T, CommissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Commissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Commissions
     * const commissions = await prisma.commission.findMany()
     * 
     * // Get first 10 Commissions
     * const commissions = await prisma.commission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commissionWithIdOnly = await prisma.commission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommissionFindManyArgs>(args?: SelectSubset<T, CommissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Commission.
     * @param {CommissionCreateArgs} args - Arguments to create a Commission.
     * @example
     * // Create one Commission
     * const Commission = await prisma.commission.create({
     *   data: {
     *     // ... data to create a Commission
     *   }
     * })
     * 
     */
    create<T extends CommissionCreateArgs>(args: SelectSubset<T, CommissionCreateArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Commissions.
     * @param {CommissionCreateManyArgs} args - Arguments to create many Commissions.
     * @example
     * // Create many Commissions
     * const commission = await prisma.commission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommissionCreateManyArgs>(args?: SelectSubset<T, CommissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Commissions and returns the data saved in the database.
     * @param {CommissionCreateManyAndReturnArgs} args - Arguments to create many Commissions.
     * @example
     * // Create many Commissions
     * const commission = await prisma.commission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Commissions and only return the `id`
     * const commissionWithIdOnly = await prisma.commission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommissionCreateManyAndReturnArgs>(args?: SelectSubset<T, CommissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Commission.
     * @param {CommissionDeleteArgs} args - Arguments to delete one Commission.
     * @example
     * // Delete one Commission
     * const Commission = await prisma.commission.delete({
     *   where: {
     *     // ... filter to delete one Commission
     *   }
     * })
     * 
     */
    delete<T extends CommissionDeleteArgs>(args: SelectSubset<T, CommissionDeleteArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Commission.
     * @param {CommissionUpdateArgs} args - Arguments to update one Commission.
     * @example
     * // Update one Commission
     * const commission = await prisma.commission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommissionUpdateArgs>(args: SelectSubset<T, CommissionUpdateArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Commissions.
     * @param {CommissionDeleteManyArgs} args - Arguments to filter Commissions to delete.
     * @example
     * // Delete a few Commissions
     * const { count } = await prisma.commission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommissionDeleteManyArgs>(args?: SelectSubset<T, CommissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Commissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Commissions
     * const commission = await prisma.commission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommissionUpdateManyArgs>(args: SelectSubset<T, CommissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Commissions and returns the data updated in the database.
     * @param {CommissionUpdateManyAndReturnArgs} args - Arguments to update many Commissions.
     * @example
     * // Update many Commissions
     * const commission = await prisma.commission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Commissions and only return the `id`
     * const commissionWithIdOnly = await prisma.commission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommissionUpdateManyAndReturnArgs>(args: SelectSubset<T, CommissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Commission.
     * @param {CommissionUpsertArgs} args - Arguments to update or create a Commission.
     * @example
     * // Update or create a Commission
     * const commission = await prisma.commission.upsert({
     *   create: {
     *     // ... data to create a Commission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Commission we want to update
     *   }
     * })
     */
    upsert<T extends CommissionUpsertArgs>(args: SelectSubset<T, CommissionUpsertArgs<ExtArgs>>): Prisma__CommissionClient<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Commissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionCountArgs} args - Arguments to filter Commissions to count.
     * @example
     * // Count the number of Commissions
     * const count = await prisma.commission.count({
     *   where: {
     *     // ... the filter for the Commissions we want to count
     *   }
     * })
    **/
    count<T extends CommissionCountArgs>(
      args?: Subset<T, CommissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Commission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommissionAggregateArgs>(args: Subset<T, CommissionAggregateArgs>): Prisma.PrismaPromise<GetCommissionAggregateType<T>>

    /**
     * Group by Commission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommissionGroupByArgs['orderBy'] }
        : { orderBy?: CommissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Commission model
   */
  readonly fields: CommissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Commission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    withdrawal<T extends Commission$withdrawalArgs<ExtArgs> = {}>(args?: Subset<T, Commission$withdrawalArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Commission model
   */
  interface CommissionFieldRefs {
    readonly id: FieldRef<"Commission", 'String'>
    readonly vendorId: FieldRef<"Commission", 'String'>
    readonly orderId: FieldRef<"Commission", 'String'>
    readonly orderItemId: FieldRef<"Commission", 'String'>
    readonly productId: FieldRef<"Commission", 'String'>
    readonly orderAmount: FieldRef<"Commission", 'Decimal'>
    readonly commissionRate: FieldRef<"Commission", 'Decimal'>
    readonly commissionAmount: FieldRef<"Commission", 'Decimal'>
    readonly netAmount: FieldRef<"Commission", 'Decimal'>
    readonly status: FieldRef<"Commission", 'CommissionStatus'>
    readonly settledAt: FieldRef<"Commission", 'DateTime'>
    readonly withdrawalId: FieldRef<"Commission", 'String'>
    readonly createdAt: FieldRef<"Commission", 'DateTime'>
    readonly updatedAt: FieldRef<"Commission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Commission findUnique
   */
  export type CommissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * Filter, which Commission to fetch.
     */
    where: CommissionWhereUniqueInput
  }

  /**
   * Commission findUniqueOrThrow
   */
  export type CommissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * Filter, which Commission to fetch.
     */
    where: CommissionWhereUniqueInput
  }

  /**
   * Commission findFirst
   */
  export type CommissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * Filter, which Commission to fetch.
     */
    where?: CommissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commissions to fetch.
     */
    orderBy?: CommissionOrderByWithRelationInput | CommissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commissions.
     */
    cursor?: CommissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commissions.
     */
    distinct?: CommissionScalarFieldEnum | CommissionScalarFieldEnum[]
  }

  /**
   * Commission findFirstOrThrow
   */
  export type CommissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * Filter, which Commission to fetch.
     */
    where?: CommissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commissions to fetch.
     */
    orderBy?: CommissionOrderByWithRelationInput | CommissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commissions.
     */
    cursor?: CommissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commissions.
     */
    distinct?: CommissionScalarFieldEnum | CommissionScalarFieldEnum[]
  }

  /**
   * Commission findMany
   */
  export type CommissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * Filter, which Commissions to fetch.
     */
    where?: CommissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commissions to fetch.
     */
    orderBy?: CommissionOrderByWithRelationInput | CommissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Commissions.
     */
    cursor?: CommissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commissions.
     */
    distinct?: CommissionScalarFieldEnum | CommissionScalarFieldEnum[]
  }

  /**
   * Commission create
   */
  export type CommissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Commission.
     */
    data: XOR<CommissionCreateInput, CommissionUncheckedCreateInput>
  }

  /**
   * Commission createMany
   */
  export type CommissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Commissions.
     */
    data: CommissionCreateManyInput | CommissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Commission createManyAndReturn
   */
  export type CommissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * The data used to create many Commissions.
     */
    data: CommissionCreateManyInput | CommissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Commission update
   */
  export type CommissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Commission.
     */
    data: XOR<CommissionUpdateInput, CommissionUncheckedUpdateInput>
    /**
     * Choose, which Commission to update.
     */
    where: CommissionWhereUniqueInput
  }

  /**
   * Commission updateMany
   */
  export type CommissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Commissions.
     */
    data: XOR<CommissionUpdateManyMutationInput, CommissionUncheckedUpdateManyInput>
    /**
     * Filter which Commissions to update
     */
    where?: CommissionWhereInput
    /**
     * Limit how many Commissions to update.
     */
    limit?: number
  }

  /**
   * Commission updateManyAndReturn
   */
  export type CommissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * The data used to update Commissions.
     */
    data: XOR<CommissionUpdateManyMutationInput, CommissionUncheckedUpdateManyInput>
    /**
     * Filter which Commissions to update
     */
    where?: CommissionWhereInput
    /**
     * Limit how many Commissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Commission upsert
   */
  export type CommissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Commission to update in case it exists.
     */
    where: CommissionWhereUniqueInput
    /**
     * In case the Commission found by the `where` argument doesn't exist, create a new Commission with this data.
     */
    create: XOR<CommissionCreateInput, CommissionUncheckedCreateInput>
    /**
     * In case the Commission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommissionUpdateInput, CommissionUncheckedUpdateInput>
  }

  /**
   * Commission delete
   */
  export type CommissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    /**
     * Filter which Commission to delete.
     */
    where: CommissionWhereUniqueInput
  }

  /**
   * Commission deleteMany
   */
  export type CommissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commissions to delete
     */
    where?: CommissionWhereInput
    /**
     * Limit how many Commissions to delete.
     */
    limit?: number
  }

  /**
   * Commission.withdrawal
   */
  export type Commission$withdrawalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    where?: WithdrawalWhereInput
  }

  /**
   * Commission without action
   */
  export type CommissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
  }


  /**
   * Model Withdrawal
   */

  export type AggregateWithdrawal = {
    _count: WithdrawalCountAggregateOutputType | null
    _avg: WithdrawalAvgAggregateOutputType | null
    _sum: WithdrawalSumAggregateOutputType | null
    _min: WithdrawalMinAggregateOutputType | null
    _max: WithdrawalMaxAggregateOutputType | null
  }

  export type WithdrawalAvgAggregateOutputType = {
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
  }

  export type WithdrawalSumAggregateOutputType = {
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
  }

  export type WithdrawalMinAggregateOutputType = {
    id: string | null
    vendorId: string | null
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    method: $Enums.WithdrawalMethod | null
    status: $Enums.WithdrawalStatus | null
    processedAt: Date | null
    processedBy: string | null
    transactionId: string | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WithdrawalMaxAggregateOutputType = {
    id: string | null
    vendorId: string | null
    amount: Decimal | null
    fee: Decimal | null
    netAmount: Decimal | null
    method: $Enums.WithdrawalMethod | null
    status: $Enums.WithdrawalStatus | null
    processedAt: Date | null
    processedBy: string | null
    transactionId: string | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WithdrawalCountAggregateOutputType = {
    id: number
    vendorId: number
    amount: number
    fee: number
    netAmount: number
    method: number
    accountDetails: number
    status: number
    processedAt: number
    processedBy: number
    transactionId: number
    rejectionReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WithdrawalAvgAggregateInputType = {
    amount?: true
    fee?: true
    netAmount?: true
  }

  export type WithdrawalSumAggregateInputType = {
    amount?: true
    fee?: true
    netAmount?: true
  }

  export type WithdrawalMinAggregateInputType = {
    id?: true
    vendorId?: true
    amount?: true
    fee?: true
    netAmount?: true
    method?: true
    status?: true
    processedAt?: true
    processedBy?: true
    transactionId?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WithdrawalMaxAggregateInputType = {
    id?: true
    vendorId?: true
    amount?: true
    fee?: true
    netAmount?: true
    method?: true
    status?: true
    processedAt?: true
    processedBy?: true
    transactionId?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WithdrawalCountAggregateInputType = {
    id?: true
    vendorId?: true
    amount?: true
    fee?: true
    netAmount?: true
    method?: true
    accountDetails?: true
    status?: true
    processedAt?: true
    processedBy?: true
    transactionId?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WithdrawalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Withdrawal to aggregate.
     */
    where?: WithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Withdrawals to fetch.
     */
    orderBy?: WithdrawalOrderByWithRelationInput | WithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Withdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Withdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Withdrawals
    **/
    _count?: true | WithdrawalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WithdrawalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WithdrawalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WithdrawalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WithdrawalMaxAggregateInputType
  }

  export type GetWithdrawalAggregateType<T extends WithdrawalAggregateArgs> = {
        [P in keyof T & keyof AggregateWithdrawal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWithdrawal[P]>
      : GetScalarType<T[P], AggregateWithdrawal[P]>
  }




  export type WithdrawalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WithdrawalWhereInput
    orderBy?: WithdrawalOrderByWithAggregationInput | WithdrawalOrderByWithAggregationInput[]
    by: WithdrawalScalarFieldEnum[] | WithdrawalScalarFieldEnum
    having?: WithdrawalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WithdrawalCountAggregateInputType | true
    _avg?: WithdrawalAvgAggregateInputType
    _sum?: WithdrawalSumAggregateInputType
    _min?: WithdrawalMinAggregateInputType
    _max?: WithdrawalMaxAggregateInputType
  }

  export type WithdrawalGroupByOutputType = {
    id: string
    vendorId: string
    amount: Decimal
    fee: Decimal
    netAmount: Decimal
    method: $Enums.WithdrawalMethod
    accountDetails: JsonValue
    status: $Enums.WithdrawalStatus
    processedAt: Date | null
    processedBy: string | null
    transactionId: string | null
    rejectionReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: WithdrawalCountAggregateOutputType | null
    _avg: WithdrawalAvgAggregateOutputType | null
    _sum: WithdrawalSumAggregateOutputType | null
    _min: WithdrawalMinAggregateOutputType | null
    _max: WithdrawalMaxAggregateOutputType | null
  }

  type GetWithdrawalGroupByPayload<T extends WithdrawalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WithdrawalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WithdrawalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WithdrawalGroupByOutputType[P]>
            : GetScalarType<T[P], WithdrawalGroupByOutputType[P]>
        }
      >
    >


  export type WithdrawalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    method?: boolean
    accountDetails?: boolean
    status?: boolean
    processedAt?: boolean
    processedBy?: boolean
    transactionId?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    commissions?: boolean | Withdrawal$commissionsArgs<ExtArgs>
    _count?: boolean | WithdrawalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["withdrawal"]>

  export type WithdrawalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    method?: boolean
    accountDetails?: boolean
    status?: boolean
    processedAt?: boolean
    processedBy?: boolean
    transactionId?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["withdrawal"]>

  export type WithdrawalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    method?: boolean
    accountDetails?: boolean
    status?: boolean
    processedAt?: boolean
    processedBy?: boolean
    transactionId?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["withdrawal"]>

  export type WithdrawalSelectScalar = {
    id?: boolean
    vendorId?: boolean
    amount?: boolean
    fee?: boolean
    netAmount?: boolean
    method?: boolean
    accountDetails?: boolean
    status?: boolean
    processedAt?: boolean
    processedBy?: boolean
    transactionId?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WithdrawalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vendorId" | "amount" | "fee" | "netAmount" | "method" | "accountDetails" | "status" | "processedAt" | "processedBy" | "transactionId" | "rejectionReason" | "createdAt" | "updatedAt", ExtArgs["result"]["withdrawal"]>
  export type WithdrawalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    commissions?: boolean | Withdrawal$commissionsArgs<ExtArgs>
    _count?: boolean | WithdrawalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WithdrawalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }
  export type WithdrawalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }

  export type $WithdrawalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Withdrawal"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
      commissions: Prisma.$CommissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vendorId: string
      amount: Prisma.Decimal
      fee: Prisma.Decimal
      netAmount: Prisma.Decimal
      method: $Enums.WithdrawalMethod
      accountDetails: Prisma.JsonValue
      status: $Enums.WithdrawalStatus
      processedAt: Date | null
      processedBy: string | null
      transactionId: string | null
      rejectionReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["withdrawal"]>
    composites: {}
  }

  type WithdrawalGetPayload<S extends boolean | null | undefined | WithdrawalDefaultArgs> = $Result.GetResult<Prisma.$WithdrawalPayload, S>

  type WithdrawalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WithdrawalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WithdrawalCountAggregateInputType | true
    }

  export interface WithdrawalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Withdrawal'], meta: { name: 'Withdrawal' } }
    /**
     * Find zero or one Withdrawal that matches the filter.
     * @param {WithdrawalFindUniqueArgs} args - Arguments to find a Withdrawal
     * @example
     * // Get one Withdrawal
     * const withdrawal = await prisma.withdrawal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WithdrawalFindUniqueArgs>(args: SelectSubset<T, WithdrawalFindUniqueArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Withdrawal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WithdrawalFindUniqueOrThrowArgs} args - Arguments to find a Withdrawal
     * @example
     * // Get one Withdrawal
     * const withdrawal = await prisma.withdrawal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WithdrawalFindUniqueOrThrowArgs>(args: SelectSubset<T, WithdrawalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Withdrawal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalFindFirstArgs} args - Arguments to find a Withdrawal
     * @example
     * // Get one Withdrawal
     * const withdrawal = await prisma.withdrawal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WithdrawalFindFirstArgs>(args?: SelectSubset<T, WithdrawalFindFirstArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Withdrawal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalFindFirstOrThrowArgs} args - Arguments to find a Withdrawal
     * @example
     * // Get one Withdrawal
     * const withdrawal = await prisma.withdrawal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WithdrawalFindFirstOrThrowArgs>(args?: SelectSubset<T, WithdrawalFindFirstOrThrowArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Withdrawals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Withdrawals
     * const withdrawals = await prisma.withdrawal.findMany()
     * 
     * // Get first 10 Withdrawals
     * const withdrawals = await prisma.withdrawal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const withdrawalWithIdOnly = await prisma.withdrawal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WithdrawalFindManyArgs>(args?: SelectSubset<T, WithdrawalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Withdrawal.
     * @param {WithdrawalCreateArgs} args - Arguments to create a Withdrawal.
     * @example
     * // Create one Withdrawal
     * const Withdrawal = await prisma.withdrawal.create({
     *   data: {
     *     // ... data to create a Withdrawal
     *   }
     * })
     * 
     */
    create<T extends WithdrawalCreateArgs>(args: SelectSubset<T, WithdrawalCreateArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Withdrawals.
     * @param {WithdrawalCreateManyArgs} args - Arguments to create many Withdrawals.
     * @example
     * // Create many Withdrawals
     * const withdrawal = await prisma.withdrawal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WithdrawalCreateManyArgs>(args?: SelectSubset<T, WithdrawalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Withdrawals and returns the data saved in the database.
     * @param {WithdrawalCreateManyAndReturnArgs} args - Arguments to create many Withdrawals.
     * @example
     * // Create many Withdrawals
     * const withdrawal = await prisma.withdrawal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Withdrawals and only return the `id`
     * const withdrawalWithIdOnly = await prisma.withdrawal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WithdrawalCreateManyAndReturnArgs>(args?: SelectSubset<T, WithdrawalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Withdrawal.
     * @param {WithdrawalDeleteArgs} args - Arguments to delete one Withdrawal.
     * @example
     * // Delete one Withdrawal
     * const Withdrawal = await prisma.withdrawal.delete({
     *   where: {
     *     // ... filter to delete one Withdrawal
     *   }
     * })
     * 
     */
    delete<T extends WithdrawalDeleteArgs>(args: SelectSubset<T, WithdrawalDeleteArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Withdrawal.
     * @param {WithdrawalUpdateArgs} args - Arguments to update one Withdrawal.
     * @example
     * // Update one Withdrawal
     * const withdrawal = await prisma.withdrawal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WithdrawalUpdateArgs>(args: SelectSubset<T, WithdrawalUpdateArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Withdrawals.
     * @param {WithdrawalDeleteManyArgs} args - Arguments to filter Withdrawals to delete.
     * @example
     * // Delete a few Withdrawals
     * const { count } = await prisma.withdrawal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WithdrawalDeleteManyArgs>(args?: SelectSubset<T, WithdrawalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Withdrawals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Withdrawals
     * const withdrawal = await prisma.withdrawal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WithdrawalUpdateManyArgs>(args: SelectSubset<T, WithdrawalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Withdrawals and returns the data updated in the database.
     * @param {WithdrawalUpdateManyAndReturnArgs} args - Arguments to update many Withdrawals.
     * @example
     * // Update many Withdrawals
     * const withdrawal = await prisma.withdrawal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Withdrawals and only return the `id`
     * const withdrawalWithIdOnly = await prisma.withdrawal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WithdrawalUpdateManyAndReturnArgs>(args: SelectSubset<T, WithdrawalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Withdrawal.
     * @param {WithdrawalUpsertArgs} args - Arguments to update or create a Withdrawal.
     * @example
     * // Update or create a Withdrawal
     * const withdrawal = await prisma.withdrawal.upsert({
     *   create: {
     *     // ... data to create a Withdrawal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Withdrawal we want to update
     *   }
     * })
     */
    upsert<T extends WithdrawalUpsertArgs>(args: SelectSubset<T, WithdrawalUpsertArgs<ExtArgs>>): Prisma__WithdrawalClient<$Result.GetResult<Prisma.$WithdrawalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Withdrawals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalCountArgs} args - Arguments to filter Withdrawals to count.
     * @example
     * // Count the number of Withdrawals
     * const count = await prisma.withdrawal.count({
     *   where: {
     *     // ... the filter for the Withdrawals we want to count
     *   }
     * })
    **/
    count<T extends WithdrawalCountArgs>(
      args?: Subset<T, WithdrawalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WithdrawalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Withdrawal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WithdrawalAggregateArgs>(args: Subset<T, WithdrawalAggregateArgs>): Prisma.PrismaPromise<GetWithdrawalAggregateType<T>>

    /**
     * Group by Withdrawal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WithdrawalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WithdrawalGroupByArgs['orderBy'] }
        : { orderBy?: WithdrawalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WithdrawalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWithdrawalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Withdrawal model
   */
  readonly fields: WithdrawalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Withdrawal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WithdrawalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    commissions<T extends Withdrawal$commissionsArgs<ExtArgs> = {}>(args?: Subset<T, Withdrawal$commissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Withdrawal model
   */
  interface WithdrawalFieldRefs {
    readonly id: FieldRef<"Withdrawal", 'String'>
    readonly vendorId: FieldRef<"Withdrawal", 'String'>
    readonly amount: FieldRef<"Withdrawal", 'Decimal'>
    readonly fee: FieldRef<"Withdrawal", 'Decimal'>
    readonly netAmount: FieldRef<"Withdrawal", 'Decimal'>
    readonly method: FieldRef<"Withdrawal", 'WithdrawalMethod'>
    readonly accountDetails: FieldRef<"Withdrawal", 'Json'>
    readonly status: FieldRef<"Withdrawal", 'WithdrawalStatus'>
    readonly processedAt: FieldRef<"Withdrawal", 'DateTime'>
    readonly processedBy: FieldRef<"Withdrawal", 'String'>
    readonly transactionId: FieldRef<"Withdrawal", 'String'>
    readonly rejectionReason: FieldRef<"Withdrawal", 'String'>
    readonly createdAt: FieldRef<"Withdrawal", 'DateTime'>
    readonly updatedAt: FieldRef<"Withdrawal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Withdrawal findUnique
   */
  export type WithdrawalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which Withdrawal to fetch.
     */
    where: WithdrawalWhereUniqueInput
  }

  /**
   * Withdrawal findUniqueOrThrow
   */
  export type WithdrawalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which Withdrawal to fetch.
     */
    where: WithdrawalWhereUniqueInput
  }

  /**
   * Withdrawal findFirst
   */
  export type WithdrawalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which Withdrawal to fetch.
     */
    where?: WithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Withdrawals to fetch.
     */
    orderBy?: WithdrawalOrderByWithRelationInput | WithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Withdrawals.
     */
    cursor?: WithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Withdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Withdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Withdrawals.
     */
    distinct?: WithdrawalScalarFieldEnum | WithdrawalScalarFieldEnum[]
  }

  /**
   * Withdrawal findFirstOrThrow
   */
  export type WithdrawalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which Withdrawal to fetch.
     */
    where?: WithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Withdrawals to fetch.
     */
    orderBy?: WithdrawalOrderByWithRelationInput | WithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Withdrawals.
     */
    cursor?: WithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Withdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Withdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Withdrawals.
     */
    distinct?: WithdrawalScalarFieldEnum | WithdrawalScalarFieldEnum[]
  }

  /**
   * Withdrawal findMany
   */
  export type WithdrawalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which Withdrawals to fetch.
     */
    where?: WithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Withdrawals to fetch.
     */
    orderBy?: WithdrawalOrderByWithRelationInput | WithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Withdrawals.
     */
    cursor?: WithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Withdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Withdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Withdrawals.
     */
    distinct?: WithdrawalScalarFieldEnum | WithdrawalScalarFieldEnum[]
  }

  /**
   * Withdrawal create
   */
  export type WithdrawalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * The data needed to create a Withdrawal.
     */
    data: XOR<WithdrawalCreateInput, WithdrawalUncheckedCreateInput>
  }

  /**
   * Withdrawal createMany
   */
  export type WithdrawalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Withdrawals.
     */
    data: WithdrawalCreateManyInput | WithdrawalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Withdrawal createManyAndReturn
   */
  export type WithdrawalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * The data used to create many Withdrawals.
     */
    data: WithdrawalCreateManyInput | WithdrawalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Withdrawal update
   */
  export type WithdrawalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * The data needed to update a Withdrawal.
     */
    data: XOR<WithdrawalUpdateInput, WithdrawalUncheckedUpdateInput>
    /**
     * Choose, which Withdrawal to update.
     */
    where: WithdrawalWhereUniqueInput
  }

  /**
   * Withdrawal updateMany
   */
  export type WithdrawalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Withdrawals.
     */
    data: XOR<WithdrawalUpdateManyMutationInput, WithdrawalUncheckedUpdateManyInput>
    /**
     * Filter which Withdrawals to update
     */
    where?: WithdrawalWhereInput
    /**
     * Limit how many Withdrawals to update.
     */
    limit?: number
  }

  /**
   * Withdrawal updateManyAndReturn
   */
  export type WithdrawalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * The data used to update Withdrawals.
     */
    data: XOR<WithdrawalUpdateManyMutationInput, WithdrawalUncheckedUpdateManyInput>
    /**
     * Filter which Withdrawals to update
     */
    where?: WithdrawalWhereInput
    /**
     * Limit how many Withdrawals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Withdrawal upsert
   */
  export type WithdrawalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * The filter to search for the Withdrawal to update in case it exists.
     */
    where: WithdrawalWhereUniqueInput
    /**
     * In case the Withdrawal found by the `where` argument doesn't exist, create a new Withdrawal with this data.
     */
    create: XOR<WithdrawalCreateInput, WithdrawalUncheckedCreateInput>
    /**
     * In case the Withdrawal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WithdrawalUpdateInput, WithdrawalUncheckedUpdateInput>
  }

  /**
   * Withdrawal delete
   */
  export type WithdrawalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
    /**
     * Filter which Withdrawal to delete.
     */
    where: WithdrawalWhereUniqueInput
  }

  /**
   * Withdrawal deleteMany
   */
  export type WithdrawalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Withdrawals to delete
     */
    where?: WithdrawalWhereInput
    /**
     * Limit how many Withdrawals to delete.
     */
    limit?: number
  }

  /**
   * Withdrawal.commissions
   */
  export type Withdrawal$commissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commission
     */
    select?: CommissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commission
     */
    omit?: CommissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommissionInclude<ExtArgs> | null
    where?: CommissionWhereInput
    orderBy?: CommissionOrderByWithRelationInput | CommissionOrderByWithRelationInput[]
    cursor?: CommissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommissionScalarFieldEnum | CommissionScalarFieldEnum[]
  }

  /**
   * Withdrawal without action
   */
  export type WithdrawalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Withdrawal
     */
    select?: WithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Withdrawal
     */
    omit?: WithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WithdrawalInclude<ExtArgs> | null
  }


  /**
   * Model VendorReview
   */

  export type AggregateVendorReview = {
    _count: VendorReviewCountAggregateOutputType | null
    _avg: VendorReviewAvgAggregateOutputType | null
    _sum: VendorReviewSumAggregateOutputType | null
    _min: VendorReviewMinAggregateOutputType | null
    _max: VendorReviewMaxAggregateOutputType | null
  }

  export type VendorReviewAvgAggregateOutputType = {
    rating: number | null
  }

  export type VendorReviewSumAggregateOutputType = {
    rating: number | null
  }

  export type VendorReviewMinAggregateOutputType = {
    id: string | null
    vendorId: string | null
    userId: string | null
    orderId: string | null
    rating: number | null
    title: string | null
    comment: string | null
    isVerifiedPurchase: boolean | null
    vendorResponse: string | null
    respondedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorReviewMaxAggregateOutputType = {
    id: string | null
    vendorId: string | null
    userId: string | null
    orderId: string | null
    rating: number | null
    title: string | null
    comment: string | null
    isVerifiedPurchase: boolean | null
    vendorResponse: string | null
    respondedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorReviewCountAggregateOutputType = {
    id: number
    vendorId: number
    userId: number
    orderId: number
    rating: number
    title: number
    comment: number
    isVerifiedPurchase: number
    vendorResponse: number
    respondedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VendorReviewAvgAggregateInputType = {
    rating?: true
  }

  export type VendorReviewSumAggregateInputType = {
    rating?: true
  }

  export type VendorReviewMinAggregateInputType = {
    id?: true
    vendorId?: true
    userId?: true
    orderId?: true
    rating?: true
    title?: true
    comment?: true
    isVerifiedPurchase?: true
    vendorResponse?: true
    respondedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorReviewMaxAggregateInputType = {
    id?: true
    vendorId?: true
    userId?: true
    orderId?: true
    rating?: true
    title?: true
    comment?: true
    isVerifiedPurchase?: true
    vendorResponse?: true
    respondedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorReviewCountAggregateInputType = {
    id?: true
    vendorId?: true
    userId?: true
    orderId?: true
    rating?: true
    title?: true
    comment?: true
    isVerifiedPurchase?: true
    vendorResponse?: true
    respondedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VendorReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorReview to aggregate.
     */
    where?: VendorReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReviews to fetch.
     */
    orderBy?: VendorReviewOrderByWithRelationInput | VendorReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VendorReviews
    **/
    _count?: true | VendorReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VendorReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VendorReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorReviewMaxAggregateInputType
  }

  export type GetVendorReviewAggregateType<T extends VendorReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateVendorReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendorReview[P]>
      : GetScalarType<T[P], AggregateVendorReview[P]>
  }




  export type VendorReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorReviewWhereInput
    orderBy?: VendorReviewOrderByWithAggregationInput | VendorReviewOrderByWithAggregationInput[]
    by: VendorReviewScalarFieldEnum[] | VendorReviewScalarFieldEnum
    having?: VendorReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorReviewCountAggregateInputType | true
    _avg?: VendorReviewAvgAggregateInputType
    _sum?: VendorReviewSumAggregateInputType
    _min?: VendorReviewMinAggregateInputType
    _max?: VendorReviewMaxAggregateInputType
  }

  export type VendorReviewGroupByOutputType = {
    id: string
    vendorId: string
    userId: string
    orderId: string
    rating: number
    title: string | null
    comment: string | null
    isVerifiedPurchase: boolean
    vendorResponse: string | null
    respondedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: VendorReviewCountAggregateOutputType | null
    _avg: VendorReviewAvgAggregateOutputType | null
    _sum: VendorReviewSumAggregateOutputType | null
    _min: VendorReviewMinAggregateOutputType | null
    _max: VendorReviewMaxAggregateOutputType | null
  }

  type GetVendorReviewGroupByPayload<T extends VendorReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorReviewGroupByOutputType[P]>
            : GetScalarType<T[P], VendorReviewGroupByOutputType[P]>
        }
      >
    >


  export type VendorReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    userId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    comment?: boolean
    isVerifiedPurchase?: boolean
    vendorResponse?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorReview"]>

  export type VendorReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    userId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    comment?: boolean
    isVerifiedPurchase?: boolean
    vendorResponse?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorReview"]>

  export type VendorReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    userId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    comment?: boolean
    isVerifiedPurchase?: boolean
    vendorResponse?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorReview"]>

  export type VendorReviewSelectScalar = {
    id?: boolean
    vendorId?: boolean
    userId?: boolean
    orderId?: boolean
    rating?: boolean
    title?: boolean
    comment?: boolean
    isVerifiedPurchase?: boolean
    vendorResponse?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VendorReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vendorId" | "userId" | "orderId" | "rating" | "title" | "comment" | "isVerifiedPurchase" | "vendorResponse" | "respondedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["vendorReview"]>
  export type VendorReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }
  export type VendorReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }
  export type VendorReviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }

  export type $VendorReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VendorReview"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vendorId: string
      userId: string
      orderId: string
      rating: number
      title: string | null
      comment: string | null
      isVerifiedPurchase: boolean
      vendorResponse: string | null
      respondedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vendorReview"]>
    composites: {}
  }

  type VendorReviewGetPayload<S extends boolean | null | undefined | VendorReviewDefaultArgs> = $Result.GetResult<Prisma.$VendorReviewPayload, S>

  type VendorReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorReviewCountAggregateInputType | true
    }

  export interface VendorReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VendorReview'], meta: { name: 'VendorReview' } }
    /**
     * Find zero or one VendorReview that matches the filter.
     * @param {VendorReviewFindUniqueArgs} args - Arguments to find a VendorReview
     * @example
     * // Get one VendorReview
     * const vendorReview = await prisma.vendorReview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorReviewFindUniqueArgs>(args: SelectSubset<T, VendorReviewFindUniqueArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VendorReview that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorReviewFindUniqueOrThrowArgs} args - Arguments to find a VendorReview
     * @example
     * // Get one VendorReview
     * const vendorReview = await prisma.vendorReview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VendorReview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewFindFirstArgs} args - Arguments to find a VendorReview
     * @example
     * // Get one VendorReview
     * const vendorReview = await prisma.vendorReview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorReviewFindFirstArgs>(args?: SelectSubset<T, VendorReviewFindFirstArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VendorReview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewFindFirstOrThrowArgs} args - Arguments to find a VendorReview
     * @example
     * // Get one VendorReview
     * const vendorReview = await prisma.vendorReview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VendorReviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VendorReviews
     * const vendorReviews = await prisma.vendorReview.findMany()
     * 
     * // Get first 10 VendorReviews
     * const vendorReviews = await prisma.vendorReview.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorReviewWithIdOnly = await prisma.vendorReview.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorReviewFindManyArgs>(args?: SelectSubset<T, VendorReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VendorReview.
     * @param {VendorReviewCreateArgs} args - Arguments to create a VendorReview.
     * @example
     * // Create one VendorReview
     * const VendorReview = await prisma.vendorReview.create({
     *   data: {
     *     // ... data to create a VendorReview
     *   }
     * })
     * 
     */
    create<T extends VendorReviewCreateArgs>(args: SelectSubset<T, VendorReviewCreateArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VendorReviews.
     * @param {VendorReviewCreateManyArgs} args - Arguments to create many VendorReviews.
     * @example
     * // Create many VendorReviews
     * const vendorReview = await prisma.vendorReview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorReviewCreateManyArgs>(args?: SelectSubset<T, VendorReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VendorReviews and returns the data saved in the database.
     * @param {VendorReviewCreateManyAndReturnArgs} args - Arguments to create many VendorReviews.
     * @example
     * // Create many VendorReviews
     * const vendorReview = await prisma.vendorReview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VendorReviews and only return the `id`
     * const vendorReviewWithIdOnly = await prisma.vendorReview.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VendorReview.
     * @param {VendorReviewDeleteArgs} args - Arguments to delete one VendorReview.
     * @example
     * // Delete one VendorReview
     * const VendorReview = await prisma.vendorReview.delete({
     *   where: {
     *     // ... filter to delete one VendorReview
     *   }
     * })
     * 
     */
    delete<T extends VendorReviewDeleteArgs>(args: SelectSubset<T, VendorReviewDeleteArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VendorReview.
     * @param {VendorReviewUpdateArgs} args - Arguments to update one VendorReview.
     * @example
     * // Update one VendorReview
     * const vendorReview = await prisma.vendorReview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorReviewUpdateArgs>(args: SelectSubset<T, VendorReviewUpdateArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VendorReviews.
     * @param {VendorReviewDeleteManyArgs} args - Arguments to filter VendorReviews to delete.
     * @example
     * // Delete a few VendorReviews
     * const { count } = await prisma.vendorReview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorReviewDeleteManyArgs>(args?: SelectSubset<T, VendorReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VendorReviews
     * const vendorReview = await prisma.vendorReview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorReviewUpdateManyArgs>(args: SelectSubset<T, VendorReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorReviews and returns the data updated in the database.
     * @param {VendorReviewUpdateManyAndReturnArgs} args - Arguments to update many VendorReviews.
     * @example
     * // Update many VendorReviews
     * const vendorReview = await prisma.vendorReview.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VendorReviews and only return the `id`
     * const vendorReviewWithIdOnly = await prisma.vendorReview.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VendorReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, VendorReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VendorReview.
     * @param {VendorReviewUpsertArgs} args - Arguments to update or create a VendorReview.
     * @example
     * // Update or create a VendorReview
     * const vendorReview = await prisma.vendorReview.upsert({
     *   create: {
     *     // ... data to create a VendorReview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VendorReview we want to update
     *   }
     * })
     */
    upsert<T extends VendorReviewUpsertArgs>(args: SelectSubset<T, VendorReviewUpsertArgs<ExtArgs>>): Prisma__VendorReviewClient<$Result.GetResult<Prisma.$VendorReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VendorReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewCountArgs} args - Arguments to filter VendorReviews to count.
     * @example
     * // Count the number of VendorReviews
     * const count = await prisma.vendorReview.count({
     *   where: {
     *     // ... the filter for the VendorReviews we want to count
     *   }
     * })
    **/
    count<T extends VendorReviewCountArgs>(
      args?: Subset<T, VendorReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VendorReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorReviewAggregateArgs>(args: Subset<T, VendorReviewAggregateArgs>): Prisma.PrismaPromise<GetVendorReviewAggregateType<T>>

    /**
     * Group by VendorReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorReviewGroupByArgs['orderBy'] }
        : { orderBy?: VendorReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VendorReview model
   */
  readonly fields: VendorReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VendorReview.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VendorReview model
   */
  interface VendorReviewFieldRefs {
    readonly id: FieldRef<"VendorReview", 'String'>
    readonly vendorId: FieldRef<"VendorReview", 'String'>
    readonly userId: FieldRef<"VendorReview", 'String'>
    readonly orderId: FieldRef<"VendorReview", 'String'>
    readonly rating: FieldRef<"VendorReview", 'Int'>
    readonly title: FieldRef<"VendorReview", 'String'>
    readonly comment: FieldRef<"VendorReview", 'String'>
    readonly isVerifiedPurchase: FieldRef<"VendorReview", 'Boolean'>
    readonly vendorResponse: FieldRef<"VendorReview", 'String'>
    readonly respondedAt: FieldRef<"VendorReview", 'DateTime'>
    readonly createdAt: FieldRef<"VendorReview", 'DateTime'>
    readonly updatedAt: FieldRef<"VendorReview", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VendorReview findUnique
   */
  export type VendorReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * Filter, which VendorReview to fetch.
     */
    where: VendorReviewWhereUniqueInput
  }

  /**
   * VendorReview findUniqueOrThrow
   */
  export type VendorReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * Filter, which VendorReview to fetch.
     */
    where: VendorReviewWhereUniqueInput
  }

  /**
   * VendorReview findFirst
   */
  export type VendorReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * Filter, which VendorReview to fetch.
     */
    where?: VendorReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReviews to fetch.
     */
    orderBy?: VendorReviewOrderByWithRelationInput | VendorReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorReviews.
     */
    cursor?: VendorReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorReviews.
     */
    distinct?: VendorReviewScalarFieldEnum | VendorReviewScalarFieldEnum[]
  }

  /**
   * VendorReview findFirstOrThrow
   */
  export type VendorReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * Filter, which VendorReview to fetch.
     */
    where?: VendorReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReviews to fetch.
     */
    orderBy?: VendorReviewOrderByWithRelationInput | VendorReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorReviews.
     */
    cursor?: VendorReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorReviews.
     */
    distinct?: VendorReviewScalarFieldEnum | VendorReviewScalarFieldEnum[]
  }

  /**
   * VendorReview findMany
   */
  export type VendorReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * Filter, which VendorReviews to fetch.
     */
    where?: VendorReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReviews to fetch.
     */
    orderBy?: VendorReviewOrderByWithRelationInput | VendorReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VendorReviews.
     */
    cursor?: VendorReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorReviews.
     */
    distinct?: VendorReviewScalarFieldEnum | VendorReviewScalarFieldEnum[]
  }

  /**
   * VendorReview create
   */
  export type VendorReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a VendorReview.
     */
    data: XOR<VendorReviewCreateInput, VendorReviewUncheckedCreateInput>
  }

  /**
   * VendorReview createMany
   */
  export type VendorReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VendorReviews.
     */
    data: VendorReviewCreateManyInput | VendorReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VendorReview createManyAndReturn
   */
  export type VendorReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * The data used to create many VendorReviews.
     */
    data: VendorReviewCreateManyInput | VendorReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VendorReview update
   */
  export type VendorReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a VendorReview.
     */
    data: XOR<VendorReviewUpdateInput, VendorReviewUncheckedUpdateInput>
    /**
     * Choose, which VendorReview to update.
     */
    where: VendorReviewWhereUniqueInput
  }

  /**
   * VendorReview updateMany
   */
  export type VendorReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VendorReviews.
     */
    data: XOR<VendorReviewUpdateManyMutationInput, VendorReviewUncheckedUpdateManyInput>
    /**
     * Filter which VendorReviews to update
     */
    where?: VendorReviewWhereInput
    /**
     * Limit how many VendorReviews to update.
     */
    limit?: number
  }

  /**
   * VendorReview updateManyAndReturn
   */
  export type VendorReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * The data used to update VendorReviews.
     */
    data: XOR<VendorReviewUpdateManyMutationInput, VendorReviewUncheckedUpdateManyInput>
    /**
     * Filter which VendorReviews to update
     */
    where?: VendorReviewWhereInput
    /**
     * Limit how many VendorReviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VendorReview upsert
   */
  export type VendorReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the VendorReview to update in case it exists.
     */
    where: VendorReviewWhereUniqueInput
    /**
     * In case the VendorReview found by the `where` argument doesn't exist, create a new VendorReview with this data.
     */
    create: XOR<VendorReviewCreateInput, VendorReviewUncheckedCreateInput>
    /**
     * In case the VendorReview was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorReviewUpdateInput, VendorReviewUncheckedUpdateInput>
  }

  /**
   * VendorReview delete
   */
  export type VendorReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
    /**
     * Filter which VendorReview to delete.
     */
    where: VendorReviewWhereUniqueInput
  }

  /**
   * VendorReview deleteMany
   */
  export type VendorReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorReviews to delete
     */
    where?: VendorReviewWhereInput
    /**
     * Limit how many VendorReviews to delete.
     */
    limit?: number
  }

  /**
   * VendorReview without action
   */
  export type VendorReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReview
     */
    select?: VendorReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReview
     */
    omit?: VendorReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorReviewInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const VendorScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    storeName: 'storeName',
    storeSlug: 'storeSlug',
    description: 'description',
    logo: 'logo',
    banner: 'banner',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    status: 'status',
    verificationStatus: 'verificationStatus',
    verifiedAt: 'verifiedAt',
    rejectionReason: 'rejectionReason',
    rating: 'rating',
    totalReviews: 'totalReviews',
    totalProducts: 'totalProducts',
    totalOrders: 'totalOrders',
    totalRevenue: 'totalRevenue',
    commissionRate: 'commissionRate',
    minimumWithdrawal: 'minimumWithdrawal',
    businessAddress: 'businessAddress',
    shippingZones: 'shippingZones',
    returnPolicy: 'returnPolicy',
    shippingPolicy: 'shippingPolicy',
    bankDetails: 'bankDetails',
    mobileWallet: 'mobileWallet',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum]


  export const VendorDocumentScalarFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    type: 'type',
    documentUrl: 'documentUrl',
    status: 'status',
    verifiedAt: 'verifiedAt',
    rejectedAt: 'rejectedAt',
    rejectionReason: 'rejectionReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VendorDocumentScalarFieldEnum = (typeof VendorDocumentScalarFieldEnum)[keyof typeof VendorDocumentScalarFieldEnum]


  export const CommissionScalarFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    orderId: 'orderId',
    orderItemId: 'orderItemId',
    productId: 'productId',
    orderAmount: 'orderAmount',
    commissionRate: 'commissionRate',
    commissionAmount: 'commissionAmount',
    netAmount: 'netAmount',
    status: 'status',
    settledAt: 'settledAt',
    withdrawalId: 'withdrawalId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommissionScalarFieldEnum = (typeof CommissionScalarFieldEnum)[keyof typeof CommissionScalarFieldEnum]


  export const WithdrawalScalarFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    amount: 'amount',
    fee: 'fee',
    netAmount: 'netAmount',
    method: 'method',
    accountDetails: 'accountDetails',
    status: 'status',
    processedAt: 'processedAt',
    processedBy: 'processedBy',
    transactionId: 'transactionId',
    rejectionReason: 'rejectionReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WithdrawalScalarFieldEnum = (typeof WithdrawalScalarFieldEnum)[keyof typeof WithdrawalScalarFieldEnum]


  export const VendorReviewScalarFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    userId: 'userId',
    orderId: 'orderId',
    rating: 'rating',
    title: 'title',
    comment: 'comment',
    isVerifiedPurchase: 'isVerifiedPurchase',
    vendorResponse: 'vendorResponse',
    respondedAt: 'respondedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VendorReviewScalarFieldEnum = (typeof VendorReviewScalarFieldEnum)[keyof typeof VendorReviewScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'VendorStatus'
   */
  export type EnumVendorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VendorStatus'>
    


  /**
   * Reference to a field of type 'VendorStatus[]'
   */
  export type ListEnumVendorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VendorStatus[]'>
    


  /**
   * Reference to a field of type 'VerificationStatus'
   */
  export type EnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus'>
    


  /**
   * Reference to a field of type 'VerificationStatus[]'
   */
  export type ListEnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DocumentType'
   */
  export type EnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType'>
    


  /**
   * Reference to a field of type 'DocumentType[]'
   */
  export type ListEnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType[]'>
    


  /**
   * Reference to a field of type 'DocumentStatus'
   */
  export type EnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus'>
    


  /**
   * Reference to a field of type 'DocumentStatus[]'
   */
  export type ListEnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus[]'>
    


  /**
   * Reference to a field of type 'CommissionStatus'
   */
  export type EnumCommissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommissionStatus'>
    


  /**
   * Reference to a field of type 'CommissionStatus[]'
   */
  export type ListEnumCommissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommissionStatus[]'>
    


  /**
   * Reference to a field of type 'WithdrawalMethod'
   */
  export type EnumWithdrawalMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WithdrawalMethod'>
    


  /**
   * Reference to a field of type 'WithdrawalMethod[]'
   */
  export type ListEnumWithdrawalMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WithdrawalMethod[]'>
    


  /**
   * Reference to a field of type 'WithdrawalStatus'
   */
  export type EnumWithdrawalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WithdrawalStatus'>
    


  /**
   * Reference to a field of type 'WithdrawalStatus[]'
   */
  export type ListEnumWithdrawalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WithdrawalStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    id?: StringFilter<"Vendor"> | string
    userId?: StringFilter<"Vendor"> | string
    storeName?: StringFilter<"Vendor"> | string
    storeSlug?: StringFilter<"Vendor"> | string
    description?: StringNullableFilter<"Vendor"> | string | null
    logo?: StringNullableFilter<"Vendor"> | string | null
    banner?: StringNullableFilter<"Vendor"> | string | null
    contactEmail?: StringFilter<"Vendor"> | string
    contactPhone?: StringNullableFilter<"Vendor"> | string | null
    status?: EnumVendorStatusFilter<"Vendor"> | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFilter<"Vendor"> | $Enums.VerificationStatus
    verifiedAt?: DateTimeNullableFilter<"Vendor"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Vendor"> | string | null
    rating?: FloatFilter<"Vendor"> | number
    totalReviews?: IntFilter<"Vendor"> | number
    totalProducts?: IntFilter<"Vendor"> | number
    totalOrders?: IntFilter<"Vendor"> | number
    totalRevenue?: DecimalFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    businessAddress?: JsonNullableFilter<"Vendor">
    shippingZones?: StringNullableListFilter<"Vendor">
    returnPolicy?: StringNullableFilter<"Vendor"> | string | null
    shippingPolicy?: StringNullableFilter<"Vendor"> | string | null
    bankDetails?: JsonNullableFilter<"Vendor">
    mobileWallet?: JsonNullableFilter<"Vendor">
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    documents?: VendorDocumentListRelationFilter
    commissions?: CommissionListRelationFilter
    withdrawals?: WithdrawalListRelationFilter
    reviews?: VendorReviewListRelationFilter
  }

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    storeName?: SortOrder
    storeSlug?: SortOrder
    description?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    banner?: SortOrderInput | SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
    businessAddress?: SortOrderInput | SortOrder
    shippingZones?: SortOrder
    returnPolicy?: SortOrderInput | SortOrder
    shippingPolicy?: SortOrderInput | SortOrder
    bankDetails?: SortOrderInput | SortOrder
    mobileWallet?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    documents?: VendorDocumentOrderByRelationAggregateInput
    commissions?: CommissionOrderByRelationAggregateInput
    withdrawals?: WithdrawalOrderByRelationAggregateInput
    reviews?: VendorReviewOrderByRelationAggregateInput
  }

  export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    storeSlug?: string
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    storeName?: StringFilter<"Vendor"> | string
    description?: StringNullableFilter<"Vendor"> | string | null
    logo?: StringNullableFilter<"Vendor"> | string | null
    banner?: StringNullableFilter<"Vendor"> | string | null
    contactEmail?: StringFilter<"Vendor"> | string
    contactPhone?: StringNullableFilter<"Vendor"> | string | null
    status?: EnumVendorStatusFilter<"Vendor"> | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFilter<"Vendor"> | $Enums.VerificationStatus
    verifiedAt?: DateTimeNullableFilter<"Vendor"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Vendor"> | string | null
    rating?: FloatFilter<"Vendor"> | number
    totalReviews?: IntFilter<"Vendor"> | number
    totalProducts?: IntFilter<"Vendor"> | number
    totalOrders?: IntFilter<"Vendor"> | number
    totalRevenue?: DecimalFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    businessAddress?: JsonNullableFilter<"Vendor">
    shippingZones?: StringNullableListFilter<"Vendor">
    returnPolicy?: StringNullableFilter<"Vendor"> | string | null
    shippingPolicy?: StringNullableFilter<"Vendor"> | string | null
    bankDetails?: JsonNullableFilter<"Vendor">
    mobileWallet?: JsonNullableFilter<"Vendor">
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    documents?: VendorDocumentListRelationFilter
    commissions?: CommissionListRelationFilter
    withdrawals?: WithdrawalListRelationFilter
    reviews?: VendorReviewListRelationFilter
  }, "id" | "userId" | "storeSlug">

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    storeName?: SortOrder
    storeSlug?: SortOrder
    description?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    banner?: SortOrderInput | SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
    businessAddress?: SortOrderInput | SortOrder
    shippingZones?: SortOrder
    returnPolicy?: SortOrderInput | SortOrder
    shippingPolicy?: SortOrderInput | SortOrder
    bankDetails?: SortOrderInput | SortOrder
    mobileWallet?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VendorCountOrderByAggregateInput
    _avg?: VendorAvgOrderByAggregateInput
    _max?: VendorMaxOrderByAggregateInput
    _min?: VendorMinOrderByAggregateInput
    _sum?: VendorSumOrderByAggregateInput
  }

  export type VendorScalarWhereWithAggregatesInput = {
    AND?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    OR?: VendorScalarWhereWithAggregatesInput[]
    NOT?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vendor"> | string
    userId?: StringWithAggregatesFilter<"Vendor"> | string
    storeName?: StringWithAggregatesFilter<"Vendor"> | string
    storeSlug?: StringWithAggregatesFilter<"Vendor"> | string
    description?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    logo?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    banner?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    contactEmail?: StringWithAggregatesFilter<"Vendor"> | string
    contactPhone?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    status?: EnumVendorStatusWithAggregatesFilter<"Vendor"> | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusWithAggregatesFilter<"Vendor"> | $Enums.VerificationStatus
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"Vendor"> | Date | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    rating?: FloatWithAggregatesFilter<"Vendor"> | number
    totalReviews?: IntWithAggregatesFilter<"Vendor"> | number
    totalProducts?: IntWithAggregatesFilter<"Vendor"> | number
    totalOrders?: IntWithAggregatesFilter<"Vendor"> | number
    totalRevenue?: DecimalWithAggregatesFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalWithAggregatesFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalWithAggregatesFilter<"Vendor"> | Decimal | DecimalJsLike | number | string
    businessAddress?: JsonNullableWithAggregatesFilter<"Vendor">
    shippingZones?: StringNullableListFilter<"Vendor">
    returnPolicy?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    shippingPolicy?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    bankDetails?: JsonNullableWithAggregatesFilter<"Vendor">
    mobileWallet?: JsonNullableWithAggregatesFilter<"Vendor">
    createdAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
  }

  export type VendorDocumentWhereInput = {
    AND?: VendorDocumentWhereInput | VendorDocumentWhereInput[]
    OR?: VendorDocumentWhereInput[]
    NOT?: VendorDocumentWhereInput | VendorDocumentWhereInput[]
    id?: StringFilter<"VendorDocument"> | string
    vendorId?: StringFilter<"VendorDocument"> | string
    type?: EnumDocumentTypeFilter<"VendorDocument"> | $Enums.DocumentType
    documentUrl?: StringFilter<"VendorDocument"> | string
    status?: EnumDocumentStatusFilter<"VendorDocument"> | $Enums.DocumentStatus
    verifiedAt?: DateTimeNullableFilter<"VendorDocument"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"VendorDocument"> | Date | string | null
    rejectionReason?: StringNullableFilter<"VendorDocument"> | string | null
    createdAt?: DateTimeFilter<"VendorDocument"> | Date | string
    updatedAt?: DateTimeFilter<"VendorDocument"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }

  export type VendorDocumentOrderByWithRelationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    documentUrl?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vendor?: VendorOrderByWithRelationInput
  }

  export type VendorDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VendorDocumentWhereInput | VendorDocumentWhereInput[]
    OR?: VendorDocumentWhereInput[]
    NOT?: VendorDocumentWhereInput | VendorDocumentWhereInput[]
    vendorId?: StringFilter<"VendorDocument"> | string
    type?: EnumDocumentTypeFilter<"VendorDocument"> | $Enums.DocumentType
    documentUrl?: StringFilter<"VendorDocument"> | string
    status?: EnumDocumentStatusFilter<"VendorDocument"> | $Enums.DocumentStatus
    verifiedAt?: DateTimeNullableFilter<"VendorDocument"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"VendorDocument"> | Date | string | null
    rejectionReason?: StringNullableFilter<"VendorDocument"> | string | null
    createdAt?: DateTimeFilter<"VendorDocument"> | Date | string
    updatedAt?: DateTimeFilter<"VendorDocument"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }, "id">

  export type VendorDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    documentUrl?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VendorDocumentCountOrderByAggregateInput
    _max?: VendorDocumentMaxOrderByAggregateInput
    _min?: VendorDocumentMinOrderByAggregateInput
  }

  export type VendorDocumentScalarWhereWithAggregatesInput = {
    AND?: VendorDocumentScalarWhereWithAggregatesInput | VendorDocumentScalarWhereWithAggregatesInput[]
    OR?: VendorDocumentScalarWhereWithAggregatesInput[]
    NOT?: VendorDocumentScalarWhereWithAggregatesInput | VendorDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VendorDocument"> | string
    vendorId?: StringWithAggregatesFilter<"VendorDocument"> | string
    type?: EnumDocumentTypeWithAggregatesFilter<"VendorDocument"> | $Enums.DocumentType
    documentUrl?: StringWithAggregatesFilter<"VendorDocument"> | string
    status?: EnumDocumentStatusWithAggregatesFilter<"VendorDocument"> | $Enums.DocumentStatus
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"VendorDocument"> | Date | string | null
    rejectedAt?: DateTimeNullableWithAggregatesFilter<"VendorDocument"> | Date | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"VendorDocument"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VendorDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VendorDocument"> | Date | string
  }

  export type CommissionWhereInput = {
    AND?: CommissionWhereInput | CommissionWhereInput[]
    OR?: CommissionWhereInput[]
    NOT?: CommissionWhereInput | CommissionWhereInput[]
    id?: StringFilter<"Commission"> | string
    vendorId?: StringFilter<"Commission"> | string
    orderId?: StringFilter<"Commission"> | string
    orderItemId?: StringNullableFilter<"Commission"> | string | null
    productId?: StringFilter<"Commission"> | string
    orderAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFilter<"Commission"> | $Enums.CommissionStatus
    settledAt?: DateTimeNullableFilter<"Commission"> | Date | string | null
    withdrawalId?: StringNullableFilter<"Commission"> | string | null
    createdAt?: DateTimeFilter<"Commission"> | Date | string
    updatedAt?: DateTimeFilter<"Commission"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    withdrawal?: XOR<WithdrawalNullableScalarRelationFilter, WithdrawalWhereInput> | null
  }

  export type CommissionOrderByWithRelationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderId?: SortOrder
    orderItemId?: SortOrderInput | SortOrder
    productId?: SortOrder
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    settledAt?: SortOrderInput | SortOrder
    withdrawalId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vendor?: VendorOrderByWithRelationInput
    withdrawal?: WithdrawalOrderByWithRelationInput
  }

  export type CommissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommissionWhereInput | CommissionWhereInput[]
    OR?: CommissionWhereInput[]
    NOT?: CommissionWhereInput | CommissionWhereInput[]
    vendorId?: StringFilter<"Commission"> | string
    orderId?: StringFilter<"Commission"> | string
    orderItemId?: StringNullableFilter<"Commission"> | string | null
    productId?: StringFilter<"Commission"> | string
    orderAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFilter<"Commission"> | $Enums.CommissionStatus
    settledAt?: DateTimeNullableFilter<"Commission"> | Date | string | null
    withdrawalId?: StringNullableFilter<"Commission"> | string | null
    createdAt?: DateTimeFilter<"Commission"> | Date | string
    updatedAt?: DateTimeFilter<"Commission"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    withdrawal?: XOR<WithdrawalNullableScalarRelationFilter, WithdrawalWhereInput> | null
  }, "id">

  export type CommissionOrderByWithAggregationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderId?: SortOrder
    orderItemId?: SortOrderInput | SortOrder
    productId?: SortOrder
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    settledAt?: SortOrderInput | SortOrder
    withdrawalId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CommissionCountOrderByAggregateInput
    _avg?: CommissionAvgOrderByAggregateInput
    _max?: CommissionMaxOrderByAggregateInput
    _min?: CommissionMinOrderByAggregateInput
    _sum?: CommissionSumOrderByAggregateInput
  }

  export type CommissionScalarWhereWithAggregatesInput = {
    AND?: CommissionScalarWhereWithAggregatesInput | CommissionScalarWhereWithAggregatesInput[]
    OR?: CommissionScalarWhereWithAggregatesInput[]
    NOT?: CommissionScalarWhereWithAggregatesInput | CommissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Commission"> | string
    vendorId?: StringWithAggregatesFilter<"Commission"> | string
    orderId?: StringWithAggregatesFilter<"Commission"> | string
    orderItemId?: StringNullableWithAggregatesFilter<"Commission"> | string | null
    productId?: StringWithAggregatesFilter<"Commission"> | string
    orderAmount?: DecimalWithAggregatesFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalWithAggregatesFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalWithAggregatesFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalWithAggregatesFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusWithAggregatesFilter<"Commission"> | $Enums.CommissionStatus
    settledAt?: DateTimeNullableWithAggregatesFilter<"Commission"> | Date | string | null
    withdrawalId?: StringNullableWithAggregatesFilter<"Commission"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Commission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Commission"> | Date | string
  }

  export type WithdrawalWhereInput = {
    AND?: WithdrawalWhereInput | WithdrawalWhereInput[]
    OR?: WithdrawalWhereInput[]
    NOT?: WithdrawalWhereInput | WithdrawalWhereInput[]
    id?: StringFilter<"Withdrawal"> | string
    vendorId?: StringFilter<"Withdrawal"> | string
    amount?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFilter<"Withdrawal"> | $Enums.WithdrawalMethod
    accountDetails?: JsonFilter<"Withdrawal">
    status?: EnumWithdrawalStatusFilter<"Withdrawal"> | $Enums.WithdrawalStatus
    processedAt?: DateTimeNullableFilter<"Withdrawal"> | Date | string | null
    processedBy?: StringNullableFilter<"Withdrawal"> | string | null
    transactionId?: StringNullableFilter<"Withdrawal"> | string | null
    rejectionReason?: StringNullableFilter<"Withdrawal"> | string | null
    createdAt?: DateTimeFilter<"Withdrawal"> | Date | string
    updatedAt?: DateTimeFilter<"Withdrawal"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    commissions?: CommissionListRelationFilter
  }

  export type WithdrawalOrderByWithRelationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    method?: SortOrder
    accountDetails?: SortOrder
    status?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    processedBy?: SortOrderInput | SortOrder
    transactionId?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vendor?: VendorOrderByWithRelationInput
    commissions?: CommissionOrderByRelationAggregateInput
  }

  export type WithdrawalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WithdrawalWhereInput | WithdrawalWhereInput[]
    OR?: WithdrawalWhereInput[]
    NOT?: WithdrawalWhereInput | WithdrawalWhereInput[]
    vendorId?: StringFilter<"Withdrawal"> | string
    amount?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFilter<"Withdrawal"> | $Enums.WithdrawalMethod
    accountDetails?: JsonFilter<"Withdrawal">
    status?: EnumWithdrawalStatusFilter<"Withdrawal"> | $Enums.WithdrawalStatus
    processedAt?: DateTimeNullableFilter<"Withdrawal"> | Date | string | null
    processedBy?: StringNullableFilter<"Withdrawal"> | string | null
    transactionId?: StringNullableFilter<"Withdrawal"> | string | null
    rejectionReason?: StringNullableFilter<"Withdrawal"> | string | null
    createdAt?: DateTimeFilter<"Withdrawal"> | Date | string
    updatedAt?: DateTimeFilter<"Withdrawal"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    commissions?: CommissionListRelationFilter
  }, "id">

  export type WithdrawalOrderByWithAggregationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    method?: SortOrder
    accountDetails?: SortOrder
    status?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    processedBy?: SortOrderInput | SortOrder
    transactionId?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WithdrawalCountOrderByAggregateInput
    _avg?: WithdrawalAvgOrderByAggregateInput
    _max?: WithdrawalMaxOrderByAggregateInput
    _min?: WithdrawalMinOrderByAggregateInput
    _sum?: WithdrawalSumOrderByAggregateInput
  }

  export type WithdrawalScalarWhereWithAggregatesInput = {
    AND?: WithdrawalScalarWhereWithAggregatesInput | WithdrawalScalarWhereWithAggregatesInput[]
    OR?: WithdrawalScalarWhereWithAggregatesInput[]
    NOT?: WithdrawalScalarWhereWithAggregatesInput | WithdrawalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Withdrawal"> | string
    vendorId?: StringWithAggregatesFilter<"Withdrawal"> | string
    amount?: DecimalWithAggregatesFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalWithAggregatesFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalWithAggregatesFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodWithAggregatesFilter<"Withdrawal"> | $Enums.WithdrawalMethod
    accountDetails?: JsonWithAggregatesFilter<"Withdrawal">
    status?: EnumWithdrawalStatusWithAggregatesFilter<"Withdrawal"> | $Enums.WithdrawalStatus
    processedAt?: DateTimeNullableWithAggregatesFilter<"Withdrawal"> | Date | string | null
    processedBy?: StringNullableWithAggregatesFilter<"Withdrawal"> | string | null
    transactionId?: StringNullableWithAggregatesFilter<"Withdrawal"> | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"Withdrawal"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Withdrawal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Withdrawal"> | Date | string
  }

  export type VendorReviewWhereInput = {
    AND?: VendorReviewWhereInput | VendorReviewWhereInput[]
    OR?: VendorReviewWhereInput[]
    NOT?: VendorReviewWhereInput | VendorReviewWhereInput[]
    id?: StringFilter<"VendorReview"> | string
    vendorId?: StringFilter<"VendorReview"> | string
    userId?: StringFilter<"VendorReview"> | string
    orderId?: StringFilter<"VendorReview"> | string
    rating?: IntFilter<"VendorReview"> | number
    title?: StringNullableFilter<"VendorReview"> | string | null
    comment?: StringNullableFilter<"VendorReview"> | string | null
    isVerifiedPurchase?: BoolFilter<"VendorReview"> | boolean
    vendorResponse?: StringNullableFilter<"VendorReview"> | string | null
    respondedAt?: DateTimeNullableFilter<"VendorReview"> | Date | string | null
    createdAt?: DateTimeFilter<"VendorReview"> | Date | string
    updatedAt?: DateTimeFilter<"VendorReview"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }

  export type VendorReviewOrderByWithRelationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrderInput | SortOrder
    comment?: SortOrderInput | SortOrder
    isVerifiedPurchase?: SortOrder
    vendorResponse?: SortOrderInput | SortOrder
    respondedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vendor?: VendorOrderByWithRelationInput
  }

  export type VendorReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_orderId?: VendorReviewUserIdOrderIdCompoundUniqueInput
    AND?: VendorReviewWhereInput | VendorReviewWhereInput[]
    OR?: VendorReviewWhereInput[]
    NOT?: VendorReviewWhereInput | VendorReviewWhereInput[]
    vendorId?: StringFilter<"VendorReview"> | string
    userId?: StringFilter<"VendorReview"> | string
    orderId?: StringFilter<"VendorReview"> | string
    rating?: IntFilter<"VendorReview"> | number
    title?: StringNullableFilter<"VendorReview"> | string | null
    comment?: StringNullableFilter<"VendorReview"> | string | null
    isVerifiedPurchase?: BoolFilter<"VendorReview"> | boolean
    vendorResponse?: StringNullableFilter<"VendorReview"> | string | null
    respondedAt?: DateTimeNullableFilter<"VendorReview"> | Date | string | null
    createdAt?: DateTimeFilter<"VendorReview"> | Date | string
    updatedAt?: DateTimeFilter<"VendorReview"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }, "id" | "userId_orderId">

  export type VendorReviewOrderByWithAggregationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrderInput | SortOrder
    comment?: SortOrderInput | SortOrder
    isVerifiedPurchase?: SortOrder
    vendorResponse?: SortOrderInput | SortOrder
    respondedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VendorReviewCountOrderByAggregateInput
    _avg?: VendorReviewAvgOrderByAggregateInput
    _max?: VendorReviewMaxOrderByAggregateInput
    _min?: VendorReviewMinOrderByAggregateInput
    _sum?: VendorReviewSumOrderByAggregateInput
  }

  export type VendorReviewScalarWhereWithAggregatesInput = {
    AND?: VendorReviewScalarWhereWithAggregatesInput | VendorReviewScalarWhereWithAggregatesInput[]
    OR?: VendorReviewScalarWhereWithAggregatesInput[]
    NOT?: VendorReviewScalarWhereWithAggregatesInput | VendorReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VendorReview"> | string
    vendorId?: StringWithAggregatesFilter<"VendorReview"> | string
    userId?: StringWithAggregatesFilter<"VendorReview"> | string
    orderId?: StringWithAggregatesFilter<"VendorReview"> | string
    rating?: IntWithAggregatesFilter<"VendorReview"> | number
    title?: StringNullableWithAggregatesFilter<"VendorReview"> | string | null
    comment?: StringNullableWithAggregatesFilter<"VendorReview"> | string | null
    isVerifiedPurchase?: BoolWithAggregatesFilter<"VendorReview"> | boolean
    vendorResponse?: StringNullableWithAggregatesFilter<"VendorReview"> | string | null
    respondedAt?: DateTimeNullableWithAggregatesFilter<"VendorReview"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VendorReview"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VendorReview"> | Date | string
  }

  export type VendorCreateInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentCreateNestedManyWithoutVendorInput
    commissions?: CommissionCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentUncheckedCreateNestedManyWithoutVendorInput
    commissions?: CommissionUncheckedCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalUncheckedCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUpdateManyWithoutVendorNestedInput
    commissions?: CommissionUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUncheckedUpdateManyWithoutVendorNestedInput
    commissions?: CommissionUncheckedUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUncheckedUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorCreateManyInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorDocumentCreateInput = {
    id?: string
    type: $Enums.DocumentType
    documentUrl: string
    status?: $Enums.DocumentStatus
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutDocumentsInput
  }

  export type VendorDocumentUncheckedCreateInput = {
    id?: string
    vendorId: string
    type: $Enums.DocumentType
    documentUrl: string
    status?: $Enums.DocumentStatus
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type VendorDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorDocumentCreateManyInput = {
    id?: string
    vendorId: string
    type: $Enums.DocumentType
    documentUrl: string
    status?: $Enums.DocumentStatus
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionCreateInput = {
    id?: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutCommissionsInput
    withdrawal?: WithdrawalCreateNestedOneWithoutCommissionsInput
  }

  export type CommissionUncheckedCreateInput = {
    id?: string
    vendorId: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    withdrawalId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutCommissionsNestedInput
    withdrawal?: WithdrawalUpdateOneWithoutCommissionsNestedInput
  }

  export type CommissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionCreateManyInput = {
    id?: string
    vendorId: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    withdrawalId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WithdrawalCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutWithdrawalsInput
    commissions?: CommissionCreateNestedManyWithoutWithdrawalInput
  }

  export type WithdrawalUncheckedCreateInput = {
    id?: string
    vendorId: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    commissions?: CommissionUncheckedCreateNestedManyWithoutWithdrawalInput
  }

  export type WithdrawalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutWithdrawalsNestedInput
    commissions?: CommissionUpdateManyWithoutWithdrawalNestedInput
  }

  export type WithdrawalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commissions?: CommissionUncheckedUpdateManyWithoutWithdrawalNestedInput
  }

  export type WithdrawalCreateManyInput = {
    id?: string
    vendorId: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WithdrawalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WithdrawalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReviewCreateInput = {
    id?: string
    userId: string
    orderId: string
    rating: number
    title?: string | null
    comment?: string | null
    isVerifiedPurchase?: boolean
    vendorResponse?: string | null
    respondedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutReviewsInput
  }

  export type VendorReviewUncheckedCreateInput = {
    id?: string
    vendorId: string
    userId: string
    orderId: string
    rating: number
    title?: string | null
    comment?: string | null
    isVerifiedPurchase?: boolean
    vendorResponse?: string | null
    respondedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type VendorReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReviewCreateManyInput = {
    id?: string
    vendorId: string
    userId: string
    orderId: string
    rating: number
    title?: string | null
    comment?: string | null
    isVerifiedPurchase?: boolean
    vendorResponse?: string | null
    respondedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumVendorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorStatus | EnumVendorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorStatusFilter<$PrismaModel> | $Enums.VendorStatus
  }

  export type EnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type VendorDocumentListRelationFilter = {
    every?: VendorDocumentWhereInput
    some?: VendorDocumentWhereInput
    none?: VendorDocumentWhereInput
  }

  export type CommissionListRelationFilter = {
    every?: CommissionWhereInput
    some?: CommissionWhereInput
    none?: CommissionWhereInput
  }

  export type WithdrawalListRelationFilter = {
    every?: WithdrawalWhereInput
    some?: WithdrawalWhereInput
    none?: WithdrawalWhereInput
  }

  export type VendorReviewListRelationFilter = {
    every?: VendorReviewWhereInput
    some?: VendorReviewWhereInput
    none?: VendorReviewWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type VendorDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WithdrawalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storeName?: SortOrder
    storeSlug?: SortOrder
    description?: SortOrder
    logo?: SortOrder
    banner?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    verifiedAt?: SortOrder
    rejectionReason?: SortOrder
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
    businessAddress?: SortOrder
    shippingZones?: SortOrder
    returnPolicy?: SortOrder
    shippingPolicy?: SortOrder
    bankDetails?: SortOrder
    mobileWallet?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorAvgOrderByAggregateInput = {
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
  }

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storeName?: SortOrder
    storeSlug?: SortOrder
    description?: SortOrder
    logo?: SortOrder
    banner?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    verifiedAt?: SortOrder
    rejectionReason?: SortOrder
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
    returnPolicy?: SortOrder
    shippingPolicy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storeName?: SortOrder
    storeSlug?: SortOrder
    description?: SortOrder
    logo?: SortOrder
    banner?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    verifiedAt?: SortOrder
    rejectionReason?: SortOrder
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
    returnPolicy?: SortOrder
    shippingPolicy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorSumOrderByAggregateInput = {
    rating?: SortOrder
    totalReviews?: SortOrder
    totalProducts?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    commissionRate?: SortOrder
    minimumWithdrawal?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumVendorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorStatus | EnumVendorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorStatusWithAggregatesFilter<$PrismaModel> | $Enums.VendorStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVendorStatusFilter<$PrismaModel>
    _max?: NestedEnumVendorStatusFilter<$PrismaModel>
  }

  export type EnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type EnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type VendorScalarRelationFilter = {
    is?: VendorWhereInput
    isNot?: VendorWhereInput
  }

  export type VendorDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    documentUrl?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    rejectedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    documentUrl?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    rejectedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    documentUrl?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    rejectedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type EnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type EnumCommissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CommissionStatus | EnumCommissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommissionStatusFilter<$PrismaModel> | $Enums.CommissionStatus
  }

  export type WithdrawalNullableScalarRelationFilter = {
    is?: WithdrawalWhereInput | null
    isNot?: WithdrawalWhereInput | null
  }

  export type CommissionCountOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderId?: SortOrder
    orderItemId?: SortOrder
    productId?: SortOrder
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    settledAt?: SortOrder
    withdrawalId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommissionAvgOrderByAggregateInput = {
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
  }

  export type CommissionMaxOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderId?: SortOrder
    orderItemId?: SortOrder
    productId?: SortOrder
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    settledAt?: SortOrder
    withdrawalId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommissionMinOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    orderId?: SortOrder
    orderItemId?: SortOrder
    productId?: SortOrder
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
    status?: SortOrder
    settledAt?: SortOrder
    withdrawalId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommissionSumOrderByAggregateInput = {
    orderAmount?: SortOrder
    commissionRate?: SortOrder
    commissionAmount?: SortOrder
    netAmount?: SortOrder
  }

  export type EnumCommissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommissionStatus | EnumCommissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.CommissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommissionStatusFilter<$PrismaModel>
    _max?: NestedEnumCommissionStatusFilter<$PrismaModel>
  }

  export type EnumWithdrawalMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalMethod | EnumWithdrawalMethodFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalMethodFilter<$PrismaModel> | $Enums.WithdrawalMethod
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumWithdrawalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalStatus | EnumWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalStatusFilter<$PrismaModel> | $Enums.WithdrawalStatus
  }

  export type WithdrawalCountOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    method?: SortOrder
    accountDetails?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    processedBy?: SortOrder
    transactionId?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WithdrawalAvgOrderByAggregateInput = {
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
  }

  export type WithdrawalMaxOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    processedBy?: SortOrder
    transactionId?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WithdrawalMinOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
    method?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    processedBy?: SortOrder
    transactionId?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WithdrawalSumOrderByAggregateInput = {
    amount?: SortOrder
    fee?: SortOrder
    netAmount?: SortOrder
  }

  export type EnumWithdrawalMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalMethod | EnumWithdrawalMethodFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalMethodWithAggregatesFilter<$PrismaModel> | $Enums.WithdrawalMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWithdrawalMethodFilter<$PrismaModel>
    _max?: NestedEnumWithdrawalMethodFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumWithdrawalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalStatus | EnumWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalStatusWithAggregatesFilter<$PrismaModel> | $Enums.WithdrawalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWithdrawalStatusFilter<$PrismaModel>
    _max?: NestedEnumWithdrawalStatusFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type VendorReviewUserIdOrderIdCompoundUniqueInput = {
    userId: string
    orderId: string
  }

  export type VendorReviewCountOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrder
    comment?: SortOrder
    isVerifiedPurchase?: SortOrder
    vendorResponse?: SortOrder
    respondedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReviewAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type VendorReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrder
    comment?: SortOrder
    isVerifiedPurchase?: SortOrder
    vendorResponse?: SortOrder
    respondedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReviewMinOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    rating?: SortOrder
    title?: SortOrder
    comment?: SortOrder
    isVerifiedPurchase?: SortOrder
    vendorResponse?: SortOrder
    respondedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReviewSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VendorCreateshippingZonesInput = {
    set: string[]
  }

  export type VendorDocumentCreateNestedManyWithoutVendorInput = {
    create?: XOR<VendorDocumentCreateWithoutVendorInput, VendorDocumentUncheckedCreateWithoutVendorInput> | VendorDocumentCreateWithoutVendorInput[] | VendorDocumentUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorDocumentCreateOrConnectWithoutVendorInput | VendorDocumentCreateOrConnectWithoutVendorInput[]
    createMany?: VendorDocumentCreateManyVendorInputEnvelope
    connect?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
  }

  export type CommissionCreateNestedManyWithoutVendorInput = {
    create?: XOR<CommissionCreateWithoutVendorInput, CommissionUncheckedCreateWithoutVendorInput> | CommissionCreateWithoutVendorInput[] | CommissionUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutVendorInput | CommissionCreateOrConnectWithoutVendorInput[]
    createMany?: CommissionCreateManyVendorInputEnvelope
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
  }

  export type WithdrawalCreateNestedManyWithoutVendorInput = {
    create?: XOR<WithdrawalCreateWithoutVendorInput, WithdrawalUncheckedCreateWithoutVendorInput> | WithdrawalCreateWithoutVendorInput[] | WithdrawalUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: WithdrawalCreateOrConnectWithoutVendorInput | WithdrawalCreateOrConnectWithoutVendorInput[]
    createMany?: WithdrawalCreateManyVendorInputEnvelope
    connect?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
  }

  export type VendorReviewCreateNestedManyWithoutVendorInput = {
    create?: XOR<VendorReviewCreateWithoutVendorInput, VendorReviewUncheckedCreateWithoutVendorInput> | VendorReviewCreateWithoutVendorInput[] | VendorReviewUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorReviewCreateOrConnectWithoutVendorInput | VendorReviewCreateOrConnectWithoutVendorInput[]
    createMany?: VendorReviewCreateManyVendorInputEnvelope
    connect?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
  }

  export type VendorDocumentUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<VendorDocumentCreateWithoutVendorInput, VendorDocumentUncheckedCreateWithoutVendorInput> | VendorDocumentCreateWithoutVendorInput[] | VendorDocumentUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorDocumentCreateOrConnectWithoutVendorInput | VendorDocumentCreateOrConnectWithoutVendorInput[]
    createMany?: VendorDocumentCreateManyVendorInputEnvelope
    connect?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
  }

  export type CommissionUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<CommissionCreateWithoutVendorInput, CommissionUncheckedCreateWithoutVendorInput> | CommissionCreateWithoutVendorInput[] | CommissionUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutVendorInput | CommissionCreateOrConnectWithoutVendorInput[]
    createMany?: CommissionCreateManyVendorInputEnvelope
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
  }

  export type WithdrawalUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<WithdrawalCreateWithoutVendorInput, WithdrawalUncheckedCreateWithoutVendorInput> | WithdrawalCreateWithoutVendorInput[] | WithdrawalUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: WithdrawalCreateOrConnectWithoutVendorInput | WithdrawalCreateOrConnectWithoutVendorInput[]
    createMany?: WithdrawalCreateManyVendorInputEnvelope
    connect?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
  }

  export type VendorReviewUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<VendorReviewCreateWithoutVendorInput, VendorReviewUncheckedCreateWithoutVendorInput> | VendorReviewCreateWithoutVendorInput[] | VendorReviewUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorReviewCreateOrConnectWithoutVendorInput | VendorReviewCreateOrConnectWithoutVendorInput[]
    createMany?: VendorReviewCreateManyVendorInputEnvelope
    connect?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumVendorStatusFieldUpdateOperationsInput = {
    set?: $Enums.VendorStatus
  }

  export type EnumVerificationStatusFieldUpdateOperationsInput = {
    set?: $Enums.VerificationStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type VendorUpdateshippingZonesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VendorDocumentUpdateManyWithoutVendorNestedInput = {
    create?: XOR<VendorDocumentCreateWithoutVendorInput, VendorDocumentUncheckedCreateWithoutVendorInput> | VendorDocumentCreateWithoutVendorInput[] | VendorDocumentUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorDocumentCreateOrConnectWithoutVendorInput | VendorDocumentCreateOrConnectWithoutVendorInput[]
    upsert?: VendorDocumentUpsertWithWhereUniqueWithoutVendorInput | VendorDocumentUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: VendorDocumentCreateManyVendorInputEnvelope
    set?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    disconnect?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    delete?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    connect?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    update?: VendorDocumentUpdateWithWhereUniqueWithoutVendorInput | VendorDocumentUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: VendorDocumentUpdateManyWithWhereWithoutVendorInput | VendorDocumentUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: VendorDocumentScalarWhereInput | VendorDocumentScalarWhereInput[]
  }

  export type CommissionUpdateManyWithoutVendorNestedInput = {
    create?: XOR<CommissionCreateWithoutVendorInput, CommissionUncheckedCreateWithoutVendorInput> | CommissionCreateWithoutVendorInput[] | CommissionUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutVendorInput | CommissionCreateOrConnectWithoutVendorInput[]
    upsert?: CommissionUpsertWithWhereUniqueWithoutVendorInput | CommissionUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: CommissionCreateManyVendorInputEnvelope
    set?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    disconnect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    delete?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    update?: CommissionUpdateWithWhereUniqueWithoutVendorInput | CommissionUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: CommissionUpdateManyWithWhereWithoutVendorInput | CommissionUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: CommissionScalarWhereInput | CommissionScalarWhereInput[]
  }

  export type WithdrawalUpdateManyWithoutVendorNestedInput = {
    create?: XOR<WithdrawalCreateWithoutVendorInput, WithdrawalUncheckedCreateWithoutVendorInput> | WithdrawalCreateWithoutVendorInput[] | WithdrawalUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: WithdrawalCreateOrConnectWithoutVendorInput | WithdrawalCreateOrConnectWithoutVendorInput[]
    upsert?: WithdrawalUpsertWithWhereUniqueWithoutVendorInput | WithdrawalUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: WithdrawalCreateManyVendorInputEnvelope
    set?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    disconnect?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    delete?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    connect?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    update?: WithdrawalUpdateWithWhereUniqueWithoutVendorInput | WithdrawalUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: WithdrawalUpdateManyWithWhereWithoutVendorInput | WithdrawalUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: WithdrawalScalarWhereInput | WithdrawalScalarWhereInput[]
  }

  export type VendorReviewUpdateManyWithoutVendorNestedInput = {
    create?: XOR<VendorReviewCreateWithoutVendorInput, VendorReviewUncheckedCreateWithoutVendorInput> | VendorReviewCreateWithoutVendorInput[] | VendorReviewUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorReviewCreateOrConnectWithoutVendorInput | VendorReviewCreateOrConnectWithoutVendorInput[]
    upsert?: VendorReviewUpsertWithWhereUniqueWithoutVendorInput | VendorReviewUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: VendorReviewCreateManyVendorInputEnvelope
    set?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    disconnect?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    delete?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    connect?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    update?: VendorReviewUpdateWithWhereUniqueWithoutVendorInput | VendorReviewUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: VendorReviewUpdateManyWithWhereWithoutVendorInput | VendorReviewUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: VendorReviewScalarWhereInput | VendorReviewScalarWhereInput[]
  }

  export type VendorDocumentUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<VendorDocumentCreateWithoutVendorInput, VendorDocumentUncheckedCreateWithoutVendorInput> | VendorDocumentCreateWithoutVendorInput[] | VendorDocumentUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorDocumentCreateOrConnectWithoutVendorInput | VendorDocumentCreateOrConnectWithoutVendorInput[]
    upsert?: VendorDocumentUpsertWithWhereUniqueWithoutVendorInput | VendorDocumentUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: VendorDocumentCreateManyVendorInputEnvelope
    set?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    disconnect?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    delete?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    connect?: VendorDocumentWhereUniqueInput | VendorDocumentWhereUniqueInput[]
    update?: VendorDocumentUpdateWithWhereUniqueWithoutVendorInput | VendorDocumentUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: VendorDocumentUpdateManyWithWhereWithoutVendorInput | VendorDocumentUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: VendorDocumentScalarWhereInput | VendorDocumentScalarWhereInput[]
  }

  export type CommissionUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<CommissionCreateWithoutVendorInput, CommissionUncheckedCreateWithoutVendorInput> | CommissionCreateWithoutVendorInput[] | CommissionUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutVendorInput | CommissionCreateOrConnectWithoutVendorInput[]
    upsert?: CommissionUpsertWithWhereUniqueWithoutVendorInput | CommissionUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: CommissionCreateManyVendorInputEnvelope
    set?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    disconnect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    delete?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    update?: CommissionUpdateWithWhereUniqueWithoutVendorInput | CommissionUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: CommissionUpdateManyWithWhereWithoutVendorInput | CommissionUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: CommissionScalarWhereInput | CommissionScalarWhereInput[]
  }

  export type WithdrawalUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<WithdrawalCreateWithoutVendorInput, WithdrawalUncheckedCreateWithoutVendorInput> | WithdrawalCreateWithoutVendorInput[] | WithdrawalUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: WithdrawalCreateOrConnectWithoutVendorInput | WithdrawalCreateOrConnectWithoutVendorInput[]
    upsert?: WithdrawalUpsertWithWhereUniqueWithoutVendorInput | WithdrawalUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: WithdrawalCreateManyVendorInputEnvelope
    set?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    disconnect?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    delete?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    connect?: WithdrawalWhereUniqueInput | WithdrawalWhereUniqueInput[]
    update?: WithdrawalUpdateWithWhereUniqueWithoutVendorInput | WithdrawalUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: WithdrawalUpdateManyWithWhereWithoutVendorInput | WithdrawalUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: WithdrawalScalarWhereInput | WithdrawalScalarWhereInput[]
  }

  export type VendorReviewUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<VendorReviewCreateWithoutVendorInput, VendorReviewUncheckedCreateWithoutVendorInput> | VendorReviewCreateWithoutVendorInput[] | VendorReviewUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: VendorReviewCreateOrConnectWithoutVendorInput | VendorReviewCreateOrConnectWithoutVendorInput[]
    upsert?: VendorReviewUpsertWithWhereUniqueWithoutVendorInput | VendorReviewUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: VendorReviewCreateManyVendorInputEnvelope
    set?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    disconnect?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    delete?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    connect?: VendorReviewWhereUniqueInput | VendorReviewWhereUniqueInput[]
    update?: VendorReviewUpdateWithWhereUniqueWithoutVendorInput | VendorReviewUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: VendorReviewUpdateManyWithWhereWithoutVendorInput | VendorReviewUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: VendorReviewScalarWhereInput | VendorReviewScalarWhereInput[]
  }

  export type VendorCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<VendorCreateWithoutDocumentsInput, VendorUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutDocumentsInput
    connect?: VendorWhereUniqueInput
  }

  export type EnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType
  }

  export type EnumDocumentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentStatus
  }

  export type VendorUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<VendorCreateWithoutDocumentsInput, VendorUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutDocumentsInput
    upsert?: VendorUpsertWithoutDocumentsInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutDocumentsInput, VendorUpdateWithoutDocumentsInput>, VendorUncheckedUpdateWithoutDocumentsInput>
  }

  export type VendorCreateNestedOneWithoutCommissionsInput = {
    create?: XOR<VendorCreateWithoutCommissionsInput, VendorUncheckedCreateWithoutCommissionsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutCommissionsInput
    connect?: VendorWhereUniqueInput
  }

  export type WithdrawalCreateNestedOneWithoutCommissionsInput = {
    create?: XOR<WithdrawalCreateWithoutCommissionsInput, WithdrawalUncheckedCreateWithoutCommissionsInput>
    connectOrCreate?: WithdrawalCreateOrConnectWithoutCommissionsInput
    connect?: WithdrawalWhereUniqueInput
  }

  export type EnumCommissionStatusFieldUpdateOperationsInput = {
    set?: $Enums.CommissionStatus
  }

  export type VendorUpdateOneRequiredWithoutCommissionsNestedInput = {
    create?: XOR<VendorCreateWithoutCommissionsInput, VendorUncheckedCreateWithoutCommissionsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutCommissionsInput
    upsert?: VendorUpsertWithoutCommissionsInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutCommissionsInput, VendorUpdateWithoutCommissionsInput>, VendorUncheckedUpdateWithoutCommissionsInput>
  }

  export type WithdrawalUpdateOneWithoutCommissionsNestedInput = {
    create?: XOR<WithdrawalCreateWithoutCommissionsInput, WithdrawalUncheckedCreateWithoutCommissionsInput>
    connectOrCreate?: WithdrawalCreateOrConnectWithoutCommissionsInput
    upsert?: WithdrawalUpsertWithoutCommissionsInput
    disconnect?: WithdrawalWhereInput | boolean
    delete?: WithdrawalWhereInput | boolean
    connect?: WithdrawalWhereUniqueInput
    update?: XOR<XOR<WithdrawalUpdateToOneWithWhereWithoutCommissionsInput, WithdrawalUpdateWithoutCommissionsInput>, WithdrawalUncheckedUpdateWithoutCommissionsInput>
  }

  export type VendorCreateNestedOneWithoutWithdrawalsInput = {
    create?: XOR<VendorCreateWithoutWithdrawalsInput, VendorUncheckedCreateWithoutWithdrawalsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutWithdrawalsInput
    connect?: VendorWhereUniqueInput
  }

  export type CommissionCreateNestedManyWithoutWithdrawalInput = {
    create?: XOR<CommissionCreateWithoutWithdrawalInput, CommissionUncheckedCreateWithoutWithdrawalInput> | CommissionCreateWithoutWithdrawalInput[] | CommissionUncheckedCreateWithoutWithdrawalInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutWithdrawalInput | CommissionCreateOrConnectWithoutWithdrawalInput[]
    createMany?: CommissionCreateManyWithdrawalInputEnvelope
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
  }

  export type CommissionUncheckedCreateNestedManyWithoutWithdrawalInput = {
    create?: XOR<CommissionCreateWithoutWithdrawalInput, CommissionUncheckedCreateWithoutWithdrawalInput> | CommissionCreateWithoutWithdrawalInput[] | CommissionUncheckedCreateWithoutWithdrawalInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutWithdrawalInput | CommissionCreateOrConnectWithoutWithdrawalInput[]
    createMany?: CommissionCreateManyWithdrawalInputEnvelope
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
  }

  export type EnumWithdrawalMethodFieldUpdateOperationsInput = {
    set?: $Enums.WithdrawalMethod
  }

  export type EnumWithdrawalStatusFieldUpdateOperationsInput = {
    set?: $Enums.WithdrawalStatus
  }

  export type VendorUpdateOneRequiredWithoutWithdrawalsNestedInput = {
    create?: XOR<VendorCreateWithoutWithdrawalsInput, VendorUncheckedCreateWithoutWithdrawalsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutWithdrawalsInput
    upsert?: VendorUpsertWithoutWithdrawalsInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutWithdrawalsInput, VendorUpdateWithoutWithdrawalsInput>, VendorUncheckedUpdateWithoutWithdrawalsInput>
  }

  export type CommissionUpdateManyWithoutWithdrawalNestedInput = {
    create?: XOR<CommissionCreateWithoutWithdrawalInput, CommissionUncheckedCreateWithoutWithdrawalInput> | CommissionCreateWithoutWithdrawalInput[] | CommissionUncheckedCreateWithoutWithdrawalInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutWithdrawalInput | CommissionCreateOrConnectWithoutWithdrawalInput[]
    upsert?: CommissionUpsertWithWhereUniqueWithoutWithdrawalInput | CommissionUpsertWithWhereUniqueWithoutWithdrawalInput[]
    createMany?: CommissionCreateManyWithdrawalInputEnvelope
    set?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    disconnect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    delete?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    update?: CommissionUpdateWithWhereUniqueWithoutWithdrawalInput | CommissionUpdateWithWhereUniqueWithoutWithdrawalInput[]
    updateMany?: CommissionUpdateManyWithWhereWithoutWithdrawalInput | CommissionUpdateManyWithWhereWithoutWithdrawalInput[]
    deleteMany?: CommissionScalarWhereInput | CommissionScalarWhereInput[]
  }

  export type CommissionUncheckedUpdateManyWithoutWithdrawalNestedInput = {
    create?: XOR<CommissionCreateWithoutWithdrawalInput, CommissionUncheckedCreateWithoutWithdrawalInput> | CommissionCreateWithoutWithdrawalInput[] | CommissionUncheckedCreateWithoutWithdrawalInput[]
    connectOrCreate?: CommissionCreateOrConnectWithoutWithdrawalInput | CommissionCreateOrConnectWithoutWithdrawalInput[]
    upsert?: CommissionUpsertWithWhereUniqueWithoutWithdrawalInput | CommissionUpsertWithWhereUniqueWithoutWithdrawalInput[]
    createMany?: CommissionCreateManyWithdrawalInputEnvelope
    set?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    disconnect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    delete?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    connect?: CommissionWhereUniqueInput | CommissionWhereUniqueInput[]
    update?: CommissionUpdateWithWhereUniqueWithoutWithdrawalInput | CommissionUpdateWithWhereUniqueWithoutWithdrawalInput[]
    updateMany?: CommissionUpdateManyWithWhereWithoutWithdrawalInput | CommissionUpdateManyWithWhereWithoutWithdrawalInput[]
    deleteMany?: CommissionScalarWhereInput | CommissionScalarWhereInput[]
  }

  export type VendorCreateNestedOneWithoutReviewsInput = {
    create?: XOR<VendorCreateWithoutReviewsInput, VendorUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutReviewsInput
    connect?: VendorWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type VendorUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<VendorCreateWithoutReviewsInput, VendorUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutReviewsInput
    upsert?: VendorUpsertWithoutReviewsInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutReviewsInput, VendorUpdateWithoutReviewsInput>, VendorUncheckedUpdateWithoutReviewsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumVendorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorStatus | EnumVendorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorStatusFilter<$PrismaModel> | $Enums.VendorStatus
  }

  export type NestedEnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumVendorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorStatus | EnumVendorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorStatus[] | ListEnumVendorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorStatusWithAggregatesFilter<$PrismaModel> | $Enums.VendorStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVendorStatusFilter<$PrismaModel>
    _max?: NestedEnumVendorStatusFilter<$PrismaModel>
  }

  export type NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type NestedEnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type NestedEnumCommissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CommissionStatus | EnumCommissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommissionStatusFilter<$PrismaModel> | $Enums.CommissionStatus
  }

  export type NestedEnumCommissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommissionStatus | EnumCommissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommissionStatus[] | ListEnumCommissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCommissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.CommissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommissionStatusFilter<$PrismaModel>
    _max?: NestedEnumCommissionStatusFilter<$PrismaModel>
  }

  export type NestedEnumWithdrawalMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalMethod | EnumWithdrawalMethodFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalMethodFilter<$PrismaModel> | $Enums.WithdrawalMethod
  }

  export type NestedEnumWithdrawalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalStatus | EnumWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalStatusFilter<$PrismaModel> | $Enums.WithdrawalStatus
  }

  export type NestedEnumWithdrawalMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalMethod | EnumWithdrawalMethodFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalMethod[] | ListEnumWithdrawalMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalMethodWithAggregatesFilter<$PrismaModel> | $Enums.WithdrawalMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWithdrawalMethodFilter<$PrismaModel>
    _max?: NestedEnumWithdrawalMethodFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumWithdrawalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WithdrawalStatus | EnumWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WithdrawalStatus[] | ListEnumWithdrawalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWithdrawalStatusWithAggregatesFilter<$PrismaModel> | $Enums.WithdrawalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWithdrawalStatusFilter<$PrismaModel>
    _max?: NestedEnumWithdrawalStatusFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VendorDocumentCreateWithoutVendorInput = {
    id?: string
    type: $Enums.DocumentType
    documentUrl: string
    status?: $Enums.DocumentStatus
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorDocumentUncheckedCreateWithoutVendorInput = {
    id?: string
    type: $Enums.DocumentType
    documentUrl: string
    status?: $Enums.DocumentStatus
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorDocumentCreateOrConnectWithoutVendorInput = {
    where: VendorDocumentWhereUniqueInput
    create: XOR<VendorDocumentCreateWithoutVendorInput, VendorDocumentUncheckedCreateWithoutVendorInput>
  }

  export type VendorDocumentCreateManyVendorInputEnvelope = {
    data: VendorDocumentCreateManyVendorInput | VendorDocumentCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type CommissionCreateWithoutVendorInput = {
    id?: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    withdrawal?: WithdrawalCreateNestedOneWithoutCommissionsInput
  }

  export type CommissionUncheckedCreateWithoutVendorInput = {
    id?: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    withdrawalId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommissionCreateOrConnectWithoutVendorInput = {
    where: CommissionWhereUniqueInput
    create: XOR<CommissionCreateWithoutVendorInput, CommissionUncheckedCreateWithoutVendorInput>
  }

  export type CommissionCreateManyVendorInputEnvelope = {
    data: CommissionCreateManyVendorInput | CommissionCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type WithdrawalCreateWithoutVendorInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    commissions?: CommissionCreateNestedManyWithoutWithdrawalInput
  }

  export type WithdrawalUncheckedCreateWithoutVendorInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    commissions?: CommissionUncheckedCreateNestedManyWithoutWithdrawalInput
  }

  export type WithdrawalCreateOrConnectWithoutVendorInput = {
    where: WithdrawalWhereUniqueInput
    create: XOR<WithdrawalCreateWithoutVendorInput, WithdrawalUncheckedCreateWithoutVendorInput>
  }

  export type WithdrawalCreateManyVendorInputEnvelope = {
    data: WithdrawalCreateManyVendorInput | WithdrawalCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type VendorReviewCreateWithoutVendorInput = {
    id?: string
    userId: string
    orderId: string
    rating: number
    title?: string | null
    comment?: string | null
    isVerifiedPurchase?: boolean
    vendorResponse?: string | null
    respondedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReviewUncheckedCreateWithoutVendorInput = {
    id?: string
    userId: string
    orderId: string
    rating: number
    title?: string | null
    comment?: string | null
    isVerifiedPurchase?: boolean
    vendorResponse?: string | null
    respondedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReviewCreateOrConnectWithoutVendorInput = {
    where: VendorReviewWhereUniqueInput
    create: XOR<VendorReviewCreateWithoutVendorInput, VendorReviewUncheckedCreateWithoutVendorInput>
  }

  export type VendorReviewCreateManyVendorInputEnvelope = {
    data: VendorReviewCreateManyVendorInput | VendorReviewCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type VendorDocumentUpsertWithWhereUniqueWithoutVendorInput = {
    where: VendorDocumentWhereUniqueInput
    update: XOR<VendorDocumentUpdateWithoutVendorInput, VendorDocumentUncheckedUpdateWithoutVendorInput>
    create: XOR<VendorDocumentCreateWithoutVendorInput, VendorDocumentUncheckedCreateWithoutVendorInput>
  }

  export type VendorDocumentUpdateWithWhereUniqueWithoutVendorInput = {
    where: VendorDocumentWhereUniqueInput
    data: XOR<VendorDocumentUpdateWithoutVendorInput, VendorDocumentUncheckedUpdateWithoutVendorInput>
  }

  export type VendorDocumentUpdateManyWithWhereWithoutVendorInput = {
    where: VendorDocumentScalarWhereInput
    data: XOR<VendorDocumentUpdateManyMutationInput, VendorDocumentUncheckedUpdateManyWithoutVendorInput>
  }

  export type VendorDocumentScalarWhereInput = {
    AND?: VendorDocumentScalarWhereInput | VendorDocumentScalarWhereInput[]
    OR?: VendorDocumentScalarWhereInput[]
    NOT?: VendorDocumentScalarWhereInput | VendorDocumentScalarWhereInput[]
    id?: StringFilter<"VendorDocument"> | string
    vendorId?: StringFilter<"VendorDocument"> | string
    type?: EnumDocumentTypeFilter<"VendorDocument"> | $Enums.DocumentType
    documentUrl?: StringFilter<"VendorDocument"> | string
    status?: EnumDocumentStatusFilter<"VendorDocument"> | $Enums.DocumentStatus
    verifiedAt?: DateTimeNullableFilter<"VendorDocument"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"VendorDocument"> | Date | string | null
    rejectionReason?: StringNullableFilter<"VendorDocument"> | string | null
    createdAt?: DateTimeFilter<"VendorDocument"> | Date | string
    updatedAt?: DateTimeFilter<"VendorDocument"> | Date | string
  }

  export type CommissionUpsertWithWhereUniqueWithoutVendorInput = {
    where: CommissionWhereUniqueInput
    update: XOR<CommissionUpdateWithoutVendorInput, CommissionUncheckedUpdateWithoutVendorInput>
    create: XOR<CommissionCreateWithoutVendorInput, CommissionUncheckedCreateWithoutVendorInput>
  }

  export type CommissionUpdateWithWhereUniqueWithoutVendorInput = {
    where: CommissionWhereUniqueInput
    data: XOR<CommissionUpdateWithoutVendorInput, CommissionUncheckedUpdateWithoutVendorInput>
  }

  export type CommissionUpdateManyWithWhereWithoutVendorInput = {
    where: CommissionScalarWhereInput
    data: XOR<CommissionUpdateManyMutationInput, CommissionUncheckedUpdateManyWithoutVendorInput>
  }

  export type CommissionScalarWhereInput = {
    AND?: CommissionScalarWhereInput | CommissionScalarWhereInput[]
    OR?: CommissionScalarWhereInput[]
    NOT?: CommissionScalarWhereInput | CommissionScalarWhereInput[]
    id?: StringFilter<"Commission"> | string
    vendorId?: StringFilter<"Commission"> | string
    orderId?: StringFilter<"Commission"> | string
    orderItemId?: StringNullableFilter<"Commission"> | string | null
    productId?: StringFilter<"Commission"> | string
    orderAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Commission"> | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFilter<"Commission"> | $Enums.CommissionStatus
    settledAt?: DateTimeNullableFilter<"Commission"> | Date | string | null
    withdrawalId?: StringNullableFilter<"Commission"> | string | null
    createdAt?: DateTimeFilter<"Commission"> | Date | string
    updatedAt?: DateTimeFilter<"Commission"> | Date | string
  }

  export type WithdrawalUpsertWithWhereUniqueWithoutVendorInput = {
    where: WithdrawalWhereUniqueInput
    update: XOR<WithdrawalUpdateWithoutVendorInput, WithdrawalUncheckedUpdateWithoutVendorInput>
    create: XOR<WithdrawalCreateWithoutVendorInput, WithdrawalUncheckedCreateWithoutVendorInput>
  }

  export type WithdrawalUpdateWithWhereUniqueWithoutVendorInput = {
    where: WithdrawalWhereUniqueInput
    data: XOR<WithdrawalUpdateWithoutVendorInput, WithdrawalUncheckedUpdateWithoutVendorInput>
  }

  export type WithdrawalUpdateManyWithWhereWithoutVendorInput = {
    where: WithdrawalScalarWhereInput
    data: XOR<WithdrawalUpdateManyMutationInput, WithdrawalUncheckedUpdateManyWithoutVendorInput>
  }

  export type WithdrawalScalarWhereInput = {
    AND?: WithdrawalScalarWhereInput | WithdrawalScalarWhereInput[]
    OR?: WithdrawalScalarWhereInput[]
    NOT?: WithdrawalScalarWhereInput | WithdrawalScalarWhereInput[]
    id?: StringFilter<"Withdrawal"> | string
    vendorId?: StringFilter<"Withdrawal"> | string
    amount?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    fee?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Withdrawal"> | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFilter<"Withdrawal"> | $Enums.WithdrawalMethod
    accountDetails?: JsonFilter<"Withdrawal">
    status?: EnumWithdrawalStatusFilter<"Withdrawal"> | $Enums.WithdrawalStatus
    processedAt?: DateTimeNullableFilter<"Withdrawal"> | Date | string | null
    processedBy?: StringNullableFilter<"Withdrawal"> | string | null
    transactionId?: StringNullableFilter<"Withdrawal"> | string | null
    rejectionReason?: StringNullableFilter<"Withdrawal"> | string | null
    createdAt?: DateTimeFilter<"Withdrawal"> | Date | string
    updatedAt?: DateTimeFilter<"Withdrawal"> | Date | string
  }

  export type VendorReviewUpsertWithWhereUniqueWithoutVendorInput = {
    where: VendorReviewWhereUniqueInput
    update: XOR<VendorReviewUpdateWithoutVendorInput, VendorReviewUncheckedUpdateWithoutVendorInput>
    create: XOR<VendorReviewCreateWithoutVendorInput, VendorReviewUncheckedCreateWithoutVendorInput>
  }

  export type VendorReviewUpdateWithWhereUniqueWithoutVendorInput = {
    where: VendorReviewWhereUniqueInput
    data: XOR<VendorReviewUpdateWithoutVendorInput, VendorReviewUncheckedUpdateWithoutVendorInput>
  }

  export type VendorReviewUpdateManyWithWhereWithoutVendorInput = {
    where: VendorReviewScalarWhereInput
    data: XOR<VendorReviewUpdateManyMutationInput, VendorReviewUncheckedUpdateManyWithoutVendorInput>
  }

  export type VendorReviewScalarWhereInput = {
    AND?: VendorReviewScalarWhereInput | VendorReviewScalarWhereInput[]
    OR?: VendorReviewScalarWhereInput[]
    NOT?: VendorReviewScalarWhereInput | VendorReviewScalarWhereInput[]
    id?: StringFilter<"VendorReview"> | string
    vendorId?: StringFilter<"VendorReview"> | string
    userId?: StringFilter<"VendorReview"> | string
    orderId?: StringFilter<"VendorReview"> | string
    rating?: IntFilter<"VendorReview"> | number
    title?: StringNullableFilter<"VendorReview"> | string | null
    comment?: StringNullableFilter<"VendorReview"> | string | null
    isVerifiedPurchase?: BoolFilter<"VendorReview"> | boolean
    vendorResponse?: StringNullableFilter<"VendorReview"> | string | null
    respondedAt?: DateTimeNullableFilter<"VendorReview"> | Date | string | null
    createdAt?: DateTimeFilter<"VendorReview"> | Date | string
    updatedAt?: DateTimeFilter<"VendorReview"> | Date | string
  }

  export type VendorCreateWithoutDocumentsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    commissions?: CommissionCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateWithoutDocumentsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    commissions?: CommissionUncheckedCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalUncheckedCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorCreateOrConnectWithoutDocumentsInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutDocumentsInput, VendorUncheckedCreateWithoutDocumentsInput>
  }

  export type VendorUpsertWithoutDocumentsInput = {
    update: XOR<VendorUpdateWithoutDocumentsInput, VendorUncheckedUpdateWithoutDocumentsInput>
    create: XOR<VendorCreateWithoutDocumentsInput, VendorUncheckedCreateWithoutDocumentsInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutDocumentsInput, VendorUncheckedUpdateWithoutDocumentsInput>
  }

  export type VendorUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commissions?: CommissionUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commissions?: CommissionUncheckedUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUncheckedUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorCreateWithoutCommissionsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateWithoutCommissionsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentUncheckedCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalUncheckedCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorCreateOrConnectWithoutCommissionsInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutCommissionsInput, VendorUncheckedCreateWithoutCommissionsInput>
  }

  export type WithdrawalCreateWithoutCommissionsInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutWithdrawalsInput
  }

  export type WithdrawalUncheckedCreateWithoutCommissionsInput = {
    id?: string
    vendorId: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WithdrawalCreateOrConnectWithoutCommissionsInput = {
    where: WithdrawalWhereUniqueInput
    create: XOR<WithdrawalCreateWithoutCommissionsInput, WithdrawalUncheckedCreateWithoutCommissionsInput>
  }

  export type VendorUpsertWithoutCommissionsInput = {
    update: XOR<VendorUpdateWithoutCommissionsInput, VendorUncheckedUpdateWithoutCommissionsInput>
    create: XOR<VendorCreateWithoutCommissionsInput, VendorUncheckedCreateWithoutCommissionsInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutCommissionsInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutCommissionsInput, VendorUncheckedUpdateWithoutCommissionsInput>
  }

  export type VendorUpdateWithoutCommissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutCommissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUncheckedUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUncheckedUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type WithdrawalUpsertWithoutCommissionsInput = {
    update: XOR<WithdrawalUpdateWithoutCommissionsInput, WithdrawalUncheckedUpdateWithoutCommissionsInput>
    create: XOR<WithdrawalCreateWithoutCommissionsInput, WithdrawalUncheckedCreateWithoutCommissionsInput>
    where?: WithdrawalWhereInput
  }

  export type WithdrawalUpdateToOneWithWhereWithoutCommissionsInput = {
    where?: WithdrawalWhereInput
    data: XOR<WithdrawalUpdateWithoutCommissionsInput, WithdrawalUncheckedUpdateWithoutCommissionsInput>
  }

  export type WithdrawalUpdateWithoutCommissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutWithdrawalsNestedInput
  }

  export type WithdrawalUncheckedUpdateWithoutCommissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorCreateWithoutWithdrawalsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentCreateNestedManyWithoutVendorInput
    commissions?: CommissionCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateWithoutWithdrawalsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentUncheckedCreateNestedManyWithoutVendorInput
    commissions?: CommissionUncheckedCreateNestedManyWithoutVendorInput
    reviews?: VendorReviewUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorCreateOrConnectWithoutWithdrawalsInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutWithdrawalsInput, VendorUncheckedCreateWithoutWithdrawalsInput>
  }

  export type CommissionCreateWithoutWithdrawalInput = {
    id?: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutCommissionsInput
  }

  export type CommissionUncheckedCreateWithoutWithdrawalInput = {
    id?: string
    vendorId: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommissionCreateOrConnectWithoutWithdrawalInput = {
    where: CommissionWhereUniqueInput
    create: XOR<CommissionCreateWithoutWithdrawalInput, CommissionUncheckedCreateWithoutWithdrawalInput>
  }

  export type CommissionCreateManyWithdrawalInputEnvelope = {
    data: CommissionCreateManyWithdrawalInput | CommissionCreateManyWithdrawalInput[]
    skipDuplicates?: boolean
  }

  export type VendorUpsertWithoutWithdrawalsInput = {
    update: XOR<VendorUpdateWithoutWithdrawalsInput, VendorUncheckedUpdateWithoutWithdrawalsInput>
    create: XOR<VendorCreateWithoutWithdrawalsInput, VendorUncheckedCreateWithoutWithdrawalsInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutWithdrawalsInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutWithdrawalsInput, VendorUncheckedUpdateWithoutWithdrawalsInput>
  }

  export type VendorUpdateWithoutWithdrawalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUpdateManyWithoutVendorNestedInput
    commissions?: CommissionUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutWithdrawalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUncheckedUpdateManyWithoutVendorNestedInput
    commissions?: CommissionUncheckedUpdateManyWithoutVendorNestedInput
    reviews?: VendorReviewUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type CommissionUpsertWithWhereUniqueWithoutWithdrawalInput = {
    where: CommissionWhereUniqueInput
    update: XOR<CommissionUpdateWithoutWithdrawalInput, CommissionUncheckedUpdateWithoutWithdrawalInput>
    create: XOR<CommissionCreateWithoutWithdrawalInput, CommissionUncheckedCreateWithoutWithdrawalInput>
  }

  export type CommissionUpdateWithWhereUniqueWithoutWithdrawalInput = {
    where: CommissionWhereUniqueInput
    data: XOR<CommissionUpdateWithoutWithdrawalInput, CommissionUncheckedUpdateWithoutWithdrawalInput>
  }

  export type CommissionUpdateManyWithWhereWithoutWithdrawalInput = {
    where: CommissionScalarWhereInput
    data: XOR<CommissionUpdateManyMutationInput, CommissionUncheckedUpdateManyWithoutWithdrawalInput>
  }

  export type VendorCreateWithoutReviewsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentCreateNestedManyWithoutVendorInput
    commissions?: CommissionCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateWithoutReviewsInput = {
    id?: string
    userId: string
    storeName: string
    storeSlug: string
    description?: string | null
    logo?: string | null
    banner?: string | null
    contactEmail: string
    contactPhone?: string | null
    status?: $Enums.VendorStatus
    verificationStatus?: $Enums.VerificationStatus
    verifiedAt?: Date | string | null
    rejectionReason?: string | null
    rating?: number
    totalReviews?: number
    totalProducts?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    commissionRate?: Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorCreateshippingZonesInput | string[]
    returnPolicy?: string | null
    shippingPolicy?: string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: VendorDocumentUncheckedCreateNestedManyWithoutVendorInput
    commissions?: CommissionUncheckedCreateNestedManyWithoutVendorInput
    withdrawals?: WithdrawalUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorCreateOrConnectWithoutReviewsInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutReviewsInput, VendorUncheckedCreateWithoutReviewsInput>
  }

  export type VendorUpsertWithoutReviewsInput = {
    update: XOR<VendorUpdateWithoutReviewsInput, VendorUncheckedUpdateWithoutReviewsInput>
    create: XOR<VendorCreateWithoutReviewsInput, VendorUncheckedCreateWithoutReviewsInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutReviewsInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutReviewsInput, VendorUncheckedUpdateWithoutReviewsInput>
  }

  export type VendorUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUpdateManyWithoutVendorNestedInput
    commissions?: CommissionUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    storeSlug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVendorStatusFieldUpdateOperationsInput | $Enums.VendorStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    totalReviews?: IntFieldUpdateOperationsInput | number
    totalProducts?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minimumWithdrawal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    businessAddress?: NullableJsonNullValueInput | InputJsonValue
    shippingZones?: VendorUpdateshippingZonesInput | string[]
    returnPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    mobileWallet?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: VendorDocumentUncheckedUpdateManyWithoutVendorNestedInput
    commissions?: CommissionUncheckedUpdateManyWithoutVendorNestedInput
    withdrawals?: WithdrawalUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorDocumentCreateManyVendorInput = {
    id?: string
    type: $Enums.DocumentType
    documentUrl: string
    status?: $Enums.DocumentStatus
    verifiedAt?: Date | string | null
    rejectedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommissionCreateManyVendorInput = {
    id?: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    withdrawalId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WithdrawalCreateManyVendorInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    fee?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    method: $Enums.WithdrawalMethod
    accountDetails: JsonNullValueInput | InputJsonValue
    status?: $Enums.WithdrawalStatus
    processedAt?: Date | string | null
    processedBy?: string | null
    transactionId?: string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReviewCreateManyVendorInput = {
    id?: string
    userId: string
    orderId: string
    rating: number
    title?: string | null
    comment?: string | null
    isVerifiedPurchase?: boolean
    vendorResponse?: string | null
    respondedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorDocumentUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorDocumentUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorDocumentUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    documentUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    withdrawal?: WithdrawalUpdateOneWithoutCommissionsNestedInput
  }

  export type CommissionUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    withdrawalId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WithdrawalUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commissions?: CommissionUpdateManyWithoutWithdrawalNestedInput
  }

  export type WithdrawalUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commissions?: CommissionUncheckedUpdateManyWithoutWithdrawalNestedInput
  }

  export type WithdrawalUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    method?: EnumWithdrawalMethodFieldUpdateOperationsInput | $Enums.WithdrawalMethod
    accountDetails?: JsonNullValueInput | InputJsonValue
    status?: EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReviewUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReviewUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReviewUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    isVerifiedPurchase?: BoolFieldUpdateOperationsInput | boolean
    vendorResponse?: NullableStringFieldUpdateOperationsInput | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionCreateManyWithdrawalInput = {
    id?: string
    vendorId: string
    orderId: string
    orderItemId?: string | null
    productId: string
    orderAmount: Decimal | DecimalJsLike | number | string
    commissionRate: Decimal | DecimalJsLike | number | string
    commissionAmount: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    status?: $Enums.CommissionStatus
    settledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommissionUpdateWithoutWithdrawalInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutCommissionsNestedInput
  }

  export type CommissionUncheckedUpdateWithoutWithdrawalInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommissionUncheckedUpdateManyWithoutWithdrawalInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    orderItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: StringFieldUpdateOperationsInput | string
    orderAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    commissionAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumCommissionStatusFieldUpdateOperationsInput | $Enums.CommissionStatus
    settledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
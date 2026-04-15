
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
 * Model DailySalesReport
 * 
 */
export type DailySalesReport = $Result.DefaultSelection<Prisma.$DailySalesReportPayload>
/**
 * Model VendorReport
 * 
 */
export type VendorReport = $Result.DefaultSelection<Prisma.$VendorReportPayload>
/**
 * Model ProductAnalytics
 * 
 */
export type ProductAnalytics = $Result.DefaultSelection<Prisma.$ProductAnalyticsPayload>
/**
 * Model CategoryAnalytics
 * 
 */
export type CategoryAnalytics = $Result.DefaultSelection<Prisma.$CategoryAnalyticsPayload>
/**
 * Model UserAnalytics
 * 
 */
export type UserAnalytics = $Result.DefaultSelection<Prisma.$UserAnalyticsPayload>
/**
 * Model EventLog
 * 
 */
export type EventLog = $Result.DefaultSelection<Prisma.$EventLogPayload>
/**
 * Model SearchAnalytics
 * 
 */
export type SearchAnalytics = $Result.DefaultSelection<Prisma.$SearchAnalyticsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more DailySalesReports
 * const dailySalesReports = await prisma.dailySalesReport.findMany()
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
   * // Fetch zero or more DailySalesReports
   * const dailySalesReports = await prisma.dailySalesReport.findMany()
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
   * `prisma.dailySalesReport`: Exposes CRUD operations for the **DailySalesReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailySalesReports
    * const dailySalesReports = await prisma.dailySalesReport.findMany()
    * ```
    */
  get dailySalesReport(): Prisma.DailySalesReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vendorReport`: Exposes CRUD operations for the **VendorReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VendorReports
    * const vendorReports = await prisma.vendorReport.findMany()
    * ```
    */
  get vendorReport(): Prisma.VendorReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productAnalytics`: Exposes CRUD operations for the **ProductAnalytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductAnalytics
    * const productAnalytics = await prisma.productAnalytics.findMany()
    * ```
    */
  get productAnalytics(): Prisma.ProductAnalyticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categoryAnalytics`: Exposes CRUD operations for the **CategoryAnalytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CategoryAnalytics
    * const categoryAnalytics = await prisma.categoryAnalytics.findMany()
    * ```
    */
  get categoryAnalytics(): Prisma.CategoryAnalyticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAnalytics`: Exposes CRUD operations for the **UserAnalytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAnalytics
    * const userAnalytics = await prisma.userAnalytics.findMany()
    * ```
    */
  get userAnalytics(): Prisma.UserAnalyticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventLog`: Exposes CRUD operations for the **EventLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventLogs
    * const eventLogs = await prisma.eventLog.findMany()
    * ```
    */
  get eventLog(): Prisma.EventLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.searchAnalytics`: Exposes CRUD operations for the **SearchAnalytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SearchAnalytics
    * const searchAnalytics = await prisma.searchAnalytics.findMany()
    * ```
    */
  get searchAnalytics(): Prisma.SearchAnalyticsDelegate<ExtArgs, ClientOptions>;
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
    DailySalesReport: 'DailySalesReport',
    VendorReport: 'VendorReport',
    ProductAnalytics: 'ProductAnalytics',
    CategoryAnalytics: 'CategoryAnalytics',
    UserAnalytics: 'UserAnalytics',
    EventLog: 'EventLog',
    SearchAnalytics: 'SearchAnalytics'
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
      modelProps: "dailySalesReport" | "vendorReport" | "productAnalytics" | "categoryAnalytics" | "userAnalytics" | "eventLog" | "searchAnalytics"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      DailySalesReport: {
        payload: Prisma.$DailySalesReportPayload<ExtArgs>
        fields: Prisma.DailySalesReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailySalesReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailySalesReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>
          }
          findFirst: {
            args: Prisma.DailySalesReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailySalesReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>
          }
          findMany: {
            args: Prisma.DailySalesReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>[]
          }
          create: {
            args: Prisma.DailySalesReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>
          }
          createMany: {
            args: Prisma.DailySalesReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailySalesReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>[]
          }
          delete: {
            args: Prisma.DailySalesReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>
          }
          update: {
            args: Prisma.DailySalesReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>
          }
          deleteMany: {
            args: Prisma.DailySalesReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailySalesReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailySalesReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>[]
          }
          upsert: {
            args: Prisma.DailySalesReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySalesReportPayload>
          }
          aggregate: {
            args: Prisma.DailySalesReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailySalesReport>
          }
          groupBy: {
            args: Prisma.DailySalesReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailySalesReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailySalesReportCountArgs<ExtArgs>
            result: $Utils.Optional<DailySalesReportCountAggregateOutputType> | number
          }
        }
      }
      VendorReport: {
        payload: Prisma.$VendorReportPayload<ExtArgs>
        fields: Prisma.VendorReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>
          }
          findFirst: {
            args: Prisma.VendorReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>
          }
          findMany: {
            args: Prisma.VendorReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>[]
          }
          create: {
            args: Prisma.VendorReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>
          }
          createMany: {
            args: Prisma.VendorReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>[]
          }
          delete: {
            args: Prisma.VendorReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>
          }
          update: {
            args: Prisma.VendorReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>
          }
          deleteMany: {
            args: Prisma.VendorReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VendorReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>[]
          }
          upsert: {
            args: Prisma.VendorReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorReportPayload>
          }
          aggregate: {
            args: Prisma.VendorReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendorReport>
          }
          groupBy: {
            args: Prisma.VendorReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorReportCountArgs<ExtArgs>
            result: $Utils.Optional<VendorReportCountAggregateOutputType> | number
          }
        }
      }
      ProductAnalytics: {
        payload: Prisma.$ProductAnalyticsPayload<ExtArgs>
        fields: Prisma.ProductAnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductAnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductAnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>
          }
          findFirst: {
            args: Prisma.ProductAnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductAnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>
          }
          findMany: {
            args: Prisma.ProductAnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>[]
          }
          create: {
            args: Prisma.ProductAnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>
          }
          createMany: {
            args: Prisma.ProductAnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductAnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>[]
          }
          delete: {
            args: Prisma.ProductAnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>
          }
          update: {
            args: Prisma.ProductAnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.ProductAnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductAnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductAnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.ProductAnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAnalyticsPayload>
          }
          aggregate: {
            args: Prisma.ProductAnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductAnalytics>
          }
          groupBy: {
            args: Prisma.ProductAnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductAnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductAnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<ProductAnalyticsCountAggregateOutputType> | number
          }
        }
      }
      CategoryAnalytics: {
        payload: Prisma.$CategoryAnalyticsPayload<ExtArgs>
        fields: Prisma.CategoryAnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryAnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryAnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>
          }
          findFirst: {
            args: Prisma.CategoryAnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryAnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>
          }
          findMany: {
            args: Prisma.CategoryAnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>[]
          }
          create: {
            args: Prisma.CategoryAnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>
          }
          createMany: {
            args: Prisma.CategoryAnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryAnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>[]
          }
          delete: {
            args: Prisma.CategoryAnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>
          }
          update: {
            args: Prisma.CategoryAnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.CategoryAnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryAnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryAnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.CategoryAnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryAnalyticsPayload>
          }
          aggregate: {
            args: Prisma.CategoryAnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoryAnalytics>
          }
          groupBy: {
            args: Prisma.CategoryAnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryAnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryAnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryAnalyticsCountAggregateOutputType> | number
          }
        }
      }
      UserAnalytics: {
        payload: Prisma.$UserAnalyticsPayload<ExtArgs>
        fields: Prisma.UserAnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>
          }
          findFirst: {
            args: Prisma.UserAnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>
          }
          findMany: {
            args: Prisma.UserAnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>[]
          }
          create: {
            args: Prisma.UserAnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>
          }
          createMany: {
            args: Prisma.UserAnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>[]
          }
          delete: {
            args: Prisma.UserAnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>
          }
          update: {
            args: Prisma.UserAnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.UserAnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.UserAnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnalyticsPayload>
          }
          aggregate: {
            args: Prisma.UserAnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAnalytics>
          }
          groupBy: {
            args: Prisma.UserAnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<UserAnalyticsCountAggregateOutputType> | number
          }
        }
      }
      EventLog: {
        payload: Prisma.$EventLogPayload<ExtArgs>
        fields: Prisma.EventLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          findFirst: {
            args: Prisma.EventLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          findMany: {
            args: Prisma.EventLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>[]
          }
          create: {
            args: Prisma.EventLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          createMany: {
            args: Prisma.EventLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>[]
          }
          delete: {
            args: Prisma.EventLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          update: {
            args: Prisma.EventLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          deleteMany: {
            args: Prisma.EventLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>[]
          }
          upsert: {
            args: Prisma.EventLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          aggregate: {
            args: Prisma.EventLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventLog>
          }
          groupBy: {
            args: Prisma.EventLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventLogCountArgs<ExtArgs>
            result: $Utils.Optional<EventLogCountAggregateOutputType> | number
          }
        }
      }
      SearchAnalytics: {
        payload: Prisma.$SearchAnalyticsPayload<ExtArgs>
        fields: Prisma.SearchAnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SearchAnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SearchAnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>
          }
          findFirst: {
            args: Prisma.SearchAnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SearchAnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>
          }
          findMany: {
            args: Prisma.SearchAnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>[]
          }
          create: {
            args: Prisma.SearchAnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>
          }
          createMany: {
            args: Prisma.SearchAnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SearchAnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>[]
          }
          delete: {
            args: Prisma.SearchAnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>
          }
          update: {
            args: Prisma.SearchAnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.SearchAnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SearchAnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SearchAnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.SearchAnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchAnalyticsPayload>
          }
          aggregate: {
            args: Prisma.SearchAnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSearchAnalytics>
          }
          groupBy: {
            args: Prisma.SearchAnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SearchAnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SearchAnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<SearchAnalyticsCountAggregateOutputType> | number
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
    dailySalesReport?: DailySalesReportOmit
    vendorReport?: VendorReportOmit
    productAnalytics?: ProductAnalyticsOmit
    categoryAnalytics?: CategoryAnalyticsOmit
    userAnalytics?: UserAnalyticsOmit
    eventLog?: EventLogOmit
    searchAnalytics?: SearchAnalyticsOmit
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
   * Models
   */

  /**
   * Model DailySalesReport
   */

  export type AggregateDailySalesReport = {
    _count: DailySalesReportCountAggregateOutputType | null
    _avg: DailySalesReportAvgAggregateOutputType | null
    _sum: DailySalesReportSumAggregateOutputType | null
    _min: DailySalesReportMinAggregateOutputType | null
    _max: DailySalesReportMaxAggregateOutputType | null
  }

  export type DailySalesReportAvgAggregateOutputType = {
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    averageOrderValue: Decimal | null
    completedOrders: number | null
    cancelledOrders: number | null
    pendingOrders: number | null
    newCustomers: number | null
    returningCustomers: number | null
    codOrders: number | null
    bkashOrders: number | null
    otherPayments: number | null
  }

  export type DailySalesReportSumAggregateOutputType = {
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    averageOrderValue: Decimal | null
    completedOrders: number | null
    cancelledOrders: number | null
    pendingOrders: number | null
    newCustomers: number | null
    returningCustomers: number | null
    codOrders: number | null
    bkashOrders: number | null
    otherPayments: number | null
  }

  export type DailySalesReportMinAggregateOutputType = {
    id: string | null
    date: Date | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    averageOrderValue: Decimal | null
    completedOrders: number | null
    cancelledOrders: number | null
    pendingOrders: number | null
    newCustomers: number | null
    returningCustomers: number | null
    codOrders: number | null
    bkashOrders: number | null
    otherPayments: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailySalesReportMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    averageOrderValue: Decimal | null
    completedOrders: number | null
    cancelledOrders: number | null
    pendingOrders: number | null
    newCustomers: number | null
    returningCustomers: number | null
    codOrders: number | null
    bkashOrders: number | null
    otherPayments: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailySalesReportCountAggregateOutputType = {
    id: number
    date: number
    totalOrders: number
    totalRevenue: number
    totalItems: number
    averageOrderValue: number
    completedOrders: number
    cancelledOrders: number
    pendingOrders: number
    newCustomers: number
    returningCustomers: number
    codOrders: number
    bkashOrders: number
    otherPayments: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DailySalesReportAvgAggregateInputType = {
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    averageOrderValue?: true
    completedOrders?: true
    cancelledOrders?: true
    pendingOrders?: true
    newCustomers?: true
    returningCustomers?: true
    codOrders?: true
    bkashOrders?: true
    otherPayments?: true
  }

  export type DailySalesReportSumAggregateInputType = {
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    averageOrderValue?: true
    completedOrders?: true
    cancelledOrders?: true
    pendingOrders?: true
    newCustomers?: true
    returningCustomers?: true
    codOrders?: true
    bkashOrders?: true
    otherPayments?: true
  }

  export type DailySalesReportMinAggregateInputType = {
    id?: true
    date?: true
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    averageOrderValue?: true
    completedOrders?: true
    cancelledOrders?: true
    pendingOrders?: true
    newCustomers?: true
    returningCustomers?: true
    codOrders?: true
    bkashOrders?: true
    otherPayments?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailySalesReportMaxAggregateInputType = {
    id?: true
    date?: true
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    averageOrderValue?: true
    completedOrders?: true
    cancelledOrders?: true
    pendingOrders?: true
    newCustomers?: true
    returningCustomers?: true
    codOrders?: true
    bkashOrders?: true
    otherPayments?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailySalesReportCountAggregateInputType = {
    id?: true
    date?: true
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    averageOrderValue?: true
    completedOrders?: true
    cancelledOrders?: true
    pendingOrders?: true
    newCustomers?: true
    returningCustomers?: true
    codOrders?: true
    bkashOrders?: true
    otherPayments?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DailySalesReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailySalesReport to aggregate.
     */
    where?: DailySalesReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySalesReports to fetch.
     */
    orderBy?: DailySalesReportOrderByWithRelationInput | DailySalesReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailySalesReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySalesReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySalesReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailySalesReports
    **/
    _count?: true | DailySalesReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailySalesReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailySalesReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailySalesReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailySalesReportMaxAggregateInputType
  }

  export type GetDailySalesReportAggregateType<T extends DailySalesReportAggregateArgs> = {
        [P in keyof T & keyof AggregateDailySalesReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailySalesReport[P]>
      : GetScalarType<T[P], AggregateDailySalesReport[P]>
  }




  export type DailySalesReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailySalesReportWhereInput
    orderBy?: DailySalesReportOrderByWithAggregationInput | DailySalesReportOrderByWithAggregationInput[]
    by: DailySalesReportScalarFieldEnum[] | DailySalesReportScalarFieldEnum
    having?: DailySalesReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailySalesReportCountAggregateInputType | true
    _avg?: DailySalesReportAvgAggregateInputType
    _sum?: DailySalesReportSumAggregateInputType
    _min?: DailySalesReportMinAggregateInputType
    _max?: DailySalesReportMaxAggregateInputType
  }

  export type DailySalesReportGroupByOutputType = {
    id: string
    date: Date
    totalOrders: number
    totalRevenue: Decimal
    totalItems: number
    averageOrderValue: Decimal
    completedOrders: number
    cancelledOrders: number
    pendingOrders: number
    newCustomers: number
    returningCustomers: number
    codOrders: number
    bkashOrders: number
    otherPayments: number
    createdAt: Date
    updatedAt: Date
    _count: DailySalesReportCountAggregateOutputType | null
    _avg: DailySalesReportAvgAggregateOutputType | null
    _sum: DailySalesReportSumAggregateOutputType | null
    _min: DailySalesReportMinAggregateOutputType | null
    _max: DailySalesReportMaxAggregateOutputType | null
  }

  type GetDailySalesReportGroupByPayload<T extends DailySalesReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailySalesReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailySalesReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailySalesReportGroupByOutputType[P]>
            : GetScalarType<T[P], DailySalesReportGroupByOutputType[P]>
        }
      >
    >


  export type DailySalesReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    averageOrderValue?: boolean
    completedOrders?: boolean
    cancelledOrders?: boolean
    pendingOrders?: boolean
    newCustomers?: boolean
    returningCustomers?: boolean
    codOrders?: boolean
    bkashOrders?: boolean
    otherPayments?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailySalesReport"]>

  export type DailySalesReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    averageOrderValue?: boolean
    completedOrders?: boolean
    cancelledOrders?: boolean
    pendingOrders?: boolean
    newCustomers?: boolean
    returningCustomers?: boolean
    codOrders?: boolean
    bkashOrders?: boolean
    otherPayments?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailySalesReport"]>

  export type DailySalesReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    averageOrderValue?: boolean
    completedOrders?: boolean
    cancelledOrders?: boolean
    pendingOrders?: boolean
    newCustomers?: boolean
    returningCustomers?: boolean
    codOrders?: boolean
    bkashOrders?: boolean
    otherPayments?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailySalesReport"]>

  export type DailySalesReportSelectScalar = {
    id?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    averageOrderValue?: boolean
    completedOrders?: boolean
    cancelledOrders?: boolean
    pendingOrders?: boolean
    newCustomers?: boolean
    returningCustomers?: boolean
    codOrders?: boolean
    bkashOrders?: boolean
    otherPayments?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DailySalesReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "totalOrders" | "totalRevenue" | "totalItems" | "averageOrderValue" | "completedOrders" | "cancelledOrders" | "pendingOrders" | "newCustomers" | "returningCustomers" | "codOrders" | "bkashOrders" | "otherPayments" | "createdAt" | "updatedAt", ExtArgs["result"]["dailySalesReport"]>

  export type $DailySalesReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailySalesReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      totalOrders: number
      totalRevenue: Prisma.Decimal
      totalItems: number
      averageOrderValue: Prisma.Decimal
      completedOrders: number
      cancelledOrders: number
      pendingOrders: number
      newCustomers: number
      returningCustomers: number
      codOrders: number
      bkashOrders: number
      otherPayments: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dailySalesReport"]>
    composites: {}
  }

  type DailySalesReportGetPayload<S extends boolean | null | undefined | DailySalesReportDefaultArgs> = $Result.GetResult<Prisma.$DailySalesReportPayload, S>

  type DailySalesReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailySalesReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailySalesReportCountAggregateInputType | true
    }

  export interface DailySalesReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailySalesReport'], meta: { name: 'DailySalesReport' } }
    /**
     * Find zero or one DailySalesReport that matches the filter.
     * @param {DailySalesReportFindUniqueArgs} args - Arguments to find a DailySalesReport
     * @example
     * // Get one DailySalesReport
     * const dailySalesReport = await prisma.dailySalesReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailySalesReportFindUniqueArgs>(args: SelectSubset<T, DailySalesReportFindUniqueArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailySalesReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailySalesReportFindUniqueOrThrowArgs} args - Arguments to find a DailySalesReport
     * @example
     * // Get one DailySalesReport
     * const dailySalesReport = await prisma.dailySalesReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailySalesReportFindUniqueOrThrowArgs>(args: SelectSubset<T, DailySalesReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailySalesReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportFindFirstArgs} args - Arguments to find a DailySalesReport
     * @example
     * // Get one DailySalesReport
     * const dailySalesReport = await prisma.dailySalesReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailySalesReportFindFirstArgs>(args?: SelectSubset<T, DailySalesReportFindFirstArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailySalesReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportFindFirstOrThrowArgs} args - Arguments to find a DailySalesReport
     * @example
     * // Get one DailySalesReport
     * const dailySalesReport = await prisma.dailySalesReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailySalesReportFindFirstOrThrowArgs>(args?: SelectSubset<T, DailySalesReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailySalesReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailySalesReports
     * const dailySalesReports = await prisma.dailySalesReport.findMany()
     * 
     * // Get first 10 DailySalesReports
     * const dailySalesReports = await prisma.dailySalesReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailySalesReportWithIdOnly = await prisma.dailySalesReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailySalesReportFindManyArgs>(args?: SelectSubset<T, DailySalesReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailySalesReport.
     * @param {DailySalesReportCreateArgs} args - Arguments to create a DailySalesReport.
     * @example
     * // Create one DailySalesReport
     * const DailySalesReport = await prisma.dailySalesReport.create({
     *   data: {
     *     // ... data to create a DailySalesReport
     *   }
     * })
     * 
     */
    create<T extends DailySalesReportCreateArgs>(args: SelectSubset<T, DailySalesReportCreateArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailySalesReports.
     * @param {DailySalesReportCreateManyArgs} args - Arguments to create many DailySalesReports.
     * @example
     * // Create many DailySalesReports
     * const dailySalesReport = await prisma.dailySalesReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailySalesReportCreateManyArgs>(args?: SelectSubset<T, DailySalesReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailySalesReports and returns the data saved in the database.
     * @param {DailySalesReportCreateManyAndReturnArgs} args - Arguments to create many DailySalesReports.
     * @example
     * // Create many DailySalesReports
     * const dailySalesReport = await prisma.dailySalesReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailySalesReports and only return the `id`
     * const dailySalesReportWithIdOnly = await prisma.dailySalesReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailySalesReportCreateManyAndReturnArgs>(args?: SelectSubset<T, DailySalesReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailySalesReport.
     * @param {DailySalesReportDeleteArgs} args - Arguments to delete one DailySalesReport.
     * @example
     * // Delete one DailySalesReport
     * const DailySalesReport = await prisma.dailySalesReport.delete({
     *   where: {
     *     // ... filter to delete one DailySalesReport
     *   }
     * })
     * 
     */
    delete<T extends DailySalesReportDeleteArgs>(args: SelectSubset<T, DailySalesReportDeleteArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailySalesReport.
     * @param {DailySalesReportUpdateArgs} args - Arguments to update one DailySalesReport.
     * @example
     * // Update one DailySalesReport
     * const dailySalesReport = await prisma.dailySalesReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailySalesReportUpdateArgs>(args: SelectSubset<T, DailySalesReportUpdateArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailySalesReports.
     * @param {DailySalesReportDeleteManyArgs} args - Arguments to filter DailySalesReports to delete.
     * @example
     * // Delete a few DailySalesReports
     * const { count } = await prisma.dailySalesReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailySalesReportDeleteManyArgs>(args?: SelectSubset<T, DailySalesReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailySalesReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailySalesReports
     * const dailySalesReport = await prisma.dailySalesReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailySalesReportUpdateManyArgs>(args: SelectSubset<T, DailySalesReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailySalesReports and returns the data updated in the database.
     * @param {DailySalesReportUpdateManyAndReturnArgs} args - Arguments to update many DailySalesReports.
     * @example
     * // Update many DailySalesReports
     * const dailySalesReport = await prisma.dailySalesReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailySalesReports and only return the `id`
     * const dailySalesReportWithIdOnly = await prisma.dailySalesReport.updateManyAndReturn({
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
    updateManyAndReturn<T extends DailySalesReportUpdateManyAndReturnArgs>(args: SelectSubset<T, DailySalesReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailySalesReport.
     * @param {DailySalesReportUpsertArgs} args - Arguments to update or create a DailySalesReport.
     * @example
     * // Update or create a DailySalesReport
     * const dailySalesReport = await prisma.dailySalesReport.upsert({
     *   create: {
     *     // ... data to create a DailySalesReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailySalesReport we want to update
     *   }
     * })
     */
    upsert<T extends DailySalesReportUpsertArgs>(args: SelectSubset<T, DailySalesReportUpsertArgs<ExtArgs>>): Prisma__DailySalesReportClient<$Result.GetResult<Prisma.$DailySalesReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailySalesReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportCountArgs} args - Arguments to filter DailySalesReports to count.
     * @example
     * // Count the number of DailySalesReports
     * const count = await prisma.dailySalesReport.count({
     *   where: {
     *     // ... the filter for the DailySalesReports we want to count
     *   }
     * })
    **/
    count<T extends DailySalesReportCountArgs>(
      args?: Subset<T, DailySalesReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailySalesReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailySalesReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DailySalesReportAggregateArgs>(args: Subset<T, DailySalesReportAggregateArgs>): Prisma.PrismaPromise<GetDailySalesReportAggregateType<T>>

    /**
     * Group by DailySalesReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySalesReportGroupByArgs} args - Group by arguments.
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
      T extends DailySalesReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailySalesReportGroupByArgs['orderBy'] }
        : { orderBy?: DailySalesReportGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DailySalesReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailySalesReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailySalesReport model
   */
  readonly fields: DailySalesReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailySalesReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailySalesReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the DailySalesReport model
   */
  interface DailySalesReportFieldRefs {
    readonly id: FieldRef<"DailySalesReport", 'String'>
    readonly date: FieldRef<"DailySalesReport", 'DateTime'>
    readonly totalOrders: FieldRef<"DailySalesReport", 'Int'>
    readonly totalRevenue: FieldRef<"DailySalesReport", 'Decimal'>
    readonly totalItems: FieldRef<"DailySalesReport", 'Int'>
    readonly averageOrderValue: FieldRef<"DailySalesReport", 'Decimal'>
    readonly completedOrders: FieldRef<"DailySalesReport", 'Int'>
    readonly cancelledOrders: FieldRef<"DailySalesReport", 'Int'>
    readonly pendingOrders: FieldRef<"DailySalesReport", 'Int'>
    readonly newCustomers: FieldRef<"DailySalesReport", 'Int'>
    readonly returningCustomers: FieldRef<"DailySalesReport", 'Int'>
    readonly codOrders: FieldRef<"DailySalesReport", 'Int'>
    readonly bkashOrders: FieldRef<"DailySalesReport", 'Int'>
    readonly otherPayments: FieldRef<"DailySalesReport", 'Int'>
    readonly createdAt: FieldRef<"DailySalesReport", 'DateTime'>
    readonly updatedAt: FieldRef<"DailySalesReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailySalesReport findUnique
   */
  export type DailySalesReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * Filter, which DailySalesReport to fetch.
     */
    where: DailySalesReportWhereUniqueInput
  }

  /**
   * DailySalesReport findUniqueOrThrow
   */
  export type DailySalesReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * Filter, which DailySalesReport to fetch.
     */
    where: DailySalesReportWhereUniqueInput
  }

  /**
   * DailySalesReport findFirst
   */
  export type DailySalesReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * Filter, which DailySalesReport to fetch.
     */
    where?: DailySalesReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySalesReports to fetch.
     */
    orderBy?: DailySalesReportOrderByWithRelationInput | DailySalesReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailySalesReports.
     */
    cursor?: DailySalesReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySalesReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySalesReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailySalesReports.
     */
    distinct?: DailySalesReportScalarFieldEnum | DailySalesReportScalarFieldEnum[]
  }

  /**
   * DailySalesReport findFirstOrThrow
   */
  export type DailySalesReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * Filter, which DailySalesReport to fetch.
     */
    where?: DailySalesReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySalesReports to fetch.
     */
    orderBy?: DailySalesReportOrderByWithRelationInput | DailySalesReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailySalesReports.
     */
    cursor?: DailySalesReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySalesReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySalesReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailySalesReports.
     */
    distinct?: DailySalesReportScalarFieldEnum | DailySalesReportScalarFieldEnum[]
  }

  /**
   * DailySalesReport findMany
   */
  export type DailySalesReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * Filter, which DailySalesReports to fetch.
     */
    where?: DailySalesReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySalesReports to fetch.
     */
    orderBy?: DailySalesReportOrderByWithRelationInput | DailySalesReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailySalesReports.
     */
    cursor?: DailySalesReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySalesReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySalesReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailySalesReports.
     */
    distinct?: DailySalesReportScalarFieldEnum | DailySalesReportScalarFieldEnum[]
  }

  /**
   * DailySalesReport create
   */
  export type DailySalesReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * The data needed to create a DailySalesReport.
     */
    data: XOR<DailySalesReportCreateInput, DailySalesReportUncheckedCreateInput>
  }

  /**
   * DailySalesReport createMany
   */
  export type DailySalesReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailySalesReports.
     */
    data: DailySalesReportCreateManyInput | DailySalesReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailySalesReport createManyAndReturn
   */
  export type DailySalesReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * The data used to create many DailySalesReports.
     */
    data: DailySalesReportCreateManyInput | DailySalesReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailySalesReport update
   */
  export type DailySalesReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * The data needed to update a DailySalesReport.
     */
    data: XOR<DailySalesReportUpdateInput, DailySalesReportUncheckedUpdateInput>
    /**
     * Choose, which DailySalesReport to update.
     */
    where: DailySalesReportWhereUniqueInput
  }

  /**
   * DailySalesReport updateMany
   */
  export type DailySalesReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailySalesReports.
     */
    data: XOR<DailySalesReportUpdateManyMutationInput, DailySalesReportUncheckedUpdateManyInput>
    /**
     * Filter which DailySalesReports to update
     */
    where?: DailySalesReportWhereInput
    /**
     * Limit how many DailySalesReports to update.
     */
    limit?: number
  }

  /**
   * DailySalesReport updateManyAndReturn
   */
  export type DailySalesReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * The data used to update DailySalesReports.
     */
    data: XOR<DailySalesReportUpdateManyMutationInput, DailySalesReportUncheckedUpdateManyInput>
    /**
     * Filter which DailySalesReports to update
     */
    where?: DailySalesReportWhereInput
    /**
     * Limit how many DailySalesReports to update.
     */
    limit?: number
  }

  /**
   * DailySalesReport upsert
   */
  export type DailySalesReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * The filter to search for the DailySalesReport to update in case it exists.
     */
    where: DailySalesReportWhereUniqueInput
    /**
     * In case the DailySalesReport found by the `where` argument doesn't exist, create a new DailySalesReport with this data.
     */
    create: XOR<DailySalesReportCreateInput, DailySalesReportUncheckedCreateInput>
    /**
     * In case the DailySalesReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailySalesReportUpdateInput, DailySalesReportUncheckedUpdateInput>
  }

  /**
   * DailySalesReport delete
   */
  export type DailySalesReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
    /**
     * Filter which DailySalesReport to delete.
     */
    where: DailySalesReportWhereUniqueInput
  }

  /**
   * DailySalesReport deleteMany
   */
  export type DailySalesReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailySalesReports to delete
     */
    where?: DailySalesReportWhereInput
    /**
     * Limit how many DailySalesReports to delete.
     */
    limit?: number
  }

  /**
   * DailySalesReport without action
   */
  export type DailySalesReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySalesReport
     */
    select?: DailySalesReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySalesReport
     */
    omit?: DailySalesReportOmit<ExtArgs> | null
  }


  /**
   * Model VendorReport
   */

  export type AggregateVendorReport = {
    _count: VendorReportCountAggregateOutputType | null
    _avg: VendorReportAvgAggregateOutputType | null
    _sum: VendorReportSumAggregateOutputType | null
    _min: VendorReportMinAggregateOutputType | null
    _max: VendorReportMaxAggregateOutputType | null
  }

  export type VendorReportAvgAggregateOutputType = {
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    commission: Decimal | null
    netRevenue: Decimal | null
    productViews: number | null
    productClickRate: number | null
    conversionRate: number | null
    averageRating: number | null
    newReviews: number | null
  }

  export type VendorReportSumAggregateOutputType = {
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    commission: Decimal | null
    netRevenue: Decimal | null
    productViews: number | null
    productClickRate: number | null
    conversionRate: number | null
    averageRating: number | null
    newReviews: number | null
  }

  export type VendorReportMinAggregateOutputType = {
    id: string | null
    vendorId: string | null
    date: Date | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    commission: Decimal | null
    netRevenue: Decimal | null
    productViews: number | null
    productClickRate: number | null
    conversionRate: number | null
    averageRating: number | null
    newReviews: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorReportMaxAggregateOutputType = {
    id: string | null
    vendorId: string | null
    date: Date | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    totalItems: number | null
    commission: Decimal | null
    netRevenue: Decimal | null
    productViews: number | null
    productClickRate: number | null
    conversionRate: number | null
    averageRating: number | null
    newReviews: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorReportCountAggregateOutputType = {
    id: number
    vendorId: number
    date: number
    totalOrders: number
    totalRevenue: number
    totalItems: number
    commission: number
    netRevenue: number
    productViews: number
    productClickRate: number
    conversionRate: number
    averageRating: number
    newReviews: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VendorReportAvgAggregateInputType = {
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    commission?: true
    netRevenue?: true
    productViews?: true
    productClickRate?: true
    conversionRate?: true
    averageRating?: true
    newReviews?: true
  }

  export type VendorReportSumAggregateInputType = {
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    commission?: true
    netRevenue?: true
    productViews?: true
    productClickRate?: true
    conversionRate?: true
    averageRating?: true
    newReviews?: true
  }

  export type VendorReportMinAggregateInputType = {
    id?: true
    vendorId?: true
    date?: true
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    commission?: true
    netRevenue?: true
    productViews?: true
    productClickRate?: true
    conversionRate?: true
    averageRating?: true
    newReviews?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorReportMaxAggregateInputType = {
    id?: true
    vendorId?: true
    date?: true
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    commission?: true
    netRevenue?: true
    productViews?: true
    productClickRate?: true
    conversionRate?: true
    averageRating?: true
    newReviews?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorReportCountAggregateInputType = {
    id?: true
    vendorId?: true
    date?: true
    totalOrders?: true
    totalRevenue?: true
    totalItems?: true
    commission?: true
    netRevenue?: true
    productViews?: true
    productClickRate?: true
    conversionRate?: true
    averageRating?: true
    newReviews?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VendorReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorReport to aggregate.
     */
    where?: VendorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReports to fetch.
     */
    orderBy?: VendorReportOrderByWithRelationInput | VendorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VendorReports
    **/
    _count?: true | VendorReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VendorReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VendorReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorReportMaxAggregateInputType
  }

  export type GetVendorReportAggregateType<T extends VendorReportAggregateArgs> = {
        [P in keyof T & keyof AggregateVendorReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendorReport[P]>
      : GetScalarType<T[P], AggregateVendorReport[P]>
  }




  export type VendorReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorReportWhereInput
    orderBy?: VendorReportOrderByWithAggregationInput | VendorReportOrderByWithAggregationInput[]
    by: VendorReportScalarFieldEnum[] | VendorReportScalarFieldEnum
    having?: VendorReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorReportCountAggregateInputType | true
    _avg?: VendorReportAvgAggregateInputType
    _sum?: VendorReportSumAggregateInputType
    _min?: VendorReportMinAggregateInputType
    _max?: VendorReportMaxAggregateInputType
  }

  export type VendorReportGroupByOutputType = {
    id: string
    vendorId: string
    date: Date
    totalOrders: number
    totalRevenue: Decimal
    totalItems: number
    commission: Decimal
    netRevenue: Decimal
    productViews: number
    productClickRate: number
    conversionRate: number
    averageRating: number
    newReviews: number
    createdAt: Date
    updatedAt: Date
    _count: VendorReportCountAggregateOutputType | null
    _avg: VendorReportAvgAggregateOutputType | null
    _sum: VendorReportSumAggregateOutputType | null
    _min: VendorReportMinAggregateOutputType | null
    _max: VendorReportMaxAggregateOutputType | null
  }

  type GetVendorReportGroupByPayload<T extends VendorReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorReportGroupByOutputType[P]>
            : GetScalarType<T[P], VendorReportGroupByOutputType[P]>
        }
      >
    >


  export type VendorReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    commission?: boolean
    netRevenue?: boolean
    productViews?: boolean
    productClickRate?: boolean
    conversionRate?: boolean
    averageRating?: boolean
    newReviews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vendorReport"]>

  export type VendorReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    commission?: boolean
    netRevenue?: boolean
    productViews?: boolean
    productClickRate?: boolean
    conversionRate?: boolean
    averageRating?: boolean
    newReviews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vendorReport"]>

  export type VendorReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    commission?: boolean
    netRevenue?: boolean
    productViews?: boolean
    productClickRate?: boolean
    conversionRate?: boolean
    averageRating?: boolean
    newReviews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vendorReport"]>

  export type VendorReportSelectScalar = {
    id?: boolean
    vendorId?: boolean
    date?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    totalItems?: boolean
    commission?: boolean
    netRevenue?: boolean
    productViews?: boolean
    productClickRate?: boolean
    conversionRate?: boolean
    averageRating?: boolean
    newReviews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VendorReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vendorId" | "date" | "totalOrders" | "totalRevenue" | "totalItems" | "commission" | "netRevenue" | "productViews" | "productClickRate" | "conversionRate" | "averageRating" | "newReviews" | "createdAt" | "updatedAt", ExtArgs["result"]["vendorReport"]>

  export type $VendorReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VendorReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vendorId: string
      date: Date
      totalOrders: number
      totalRevenue: Prisma.Decimal
      totalItems: number
      commission: Prisma.Decimal
      netRevenue: Prisma.Decimal
      productViews: number
      productClickRate: number
      conversionRate: number
      averageRating: number
      newReviews: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vendorReport"]>
    composites: {}
  }

  type VendorReportGetPayload<S extends boolean | null | undefined | VendorReportDefaultArgs> = $Result.GetResult<Prisma.$VendorReportPayload, S>

  type VendorReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorReportCountAggregateInputType | true
    }

  export interface VendorReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VendorReport'], meta: { name: 'VendorReport' } }
    /**
     * Find zero or one VendorReport that matches the filter.
     * @param {VendorReportFindUniqueArgs} args - Arguments to find a VendorReport
     * @example
     * // Get one VendorReport
     * const vendorReport = await prisma.vendorReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorReportFindUniqueArgs>(args: SelectSubset<T, VendorReportFindUniqueArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VendorReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorReportFindUniqueOrThrowArgs} args - Arguments to find a VendorReport
     * @example
     * // Get one VendorReport
     * const vendorReport = await prisma.vendorReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorReportFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VendorReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportFindFirstArgs} args - Arguments to find a VendorReport
     * @example
     * // Get one VendorReport
     * const vendorReport = await prisma.vendorReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorReportFindFirstArgs>(args?: SelectSubset<T, VendorReportFindFirstArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VendorReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportFindFirstOrThrowArgs} args - Arguments to find a VendorReport
     * @example
     * // Get one VendorReport
     * const vendorReport = await prisma.vendorReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorReportFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VendorReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VendorReports
     * const vendorReports = await prisma.vendorReport.findMany()
     * 
     * // Get first 10 VendorReports
     * const vendorReports = await prisma.vendorReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorReportWithIdOnly = await prisma.vendorReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorReportFindManyArgs>(args?: SelectSubset<T, VendorReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VendorReport.
     * @param {VendorReportCreateArgs} args - Arguments to create a VendorReport.
     * @example
     * // Create one VendorReport
     * const VendorReport = await prisma.vendorReport.create({
     *   data: {
     *     // ... data to create a VendorReport
     *   }
     * })
     * 
     */
    create<T extends VendorReportCreateArgs>(args: SelectSubset<T, VendorReportCreateArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VendorReports.
     * @param {VendorReportCreateManyArgs} args - Arguments to create many VendorReports.
     * @example
     * // Create many VendorReports
     * const vendorReport = await prisma.vendorReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorReportCreateManyArgs>(args?: SelectSubset<T, VendorReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VendorReports and returns the data saved in the database.
     * @param {VendorReportCreateManyAndReturnArgs} args - Arguments to create many VendorReports.
     * @example
     * // Create many VendorReports
     * const vendorReport = await prisma.vendorReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VendorReports and only return the `id`
     * const vendorReportWithIdOnly = await prisma.vendorReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorReportCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VendorReport.
     * @param {VendorReportDeleteArgs} args - Arguments to delete one VendorReport.
     * @example
     * // Delete one VendorReport
     * const VendorReport = await prisma.vendorReport.delete({
     *   where: {
     *     // ... filter to delete one VendorReport
     *   }
     * })
     * 
     */
    delete<T extends VendorReportDeleteArgs>(args: SelectSubset<T, VendorReportDeleteArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VendorReport.
     * @param {VendorReportUpdateArgs} args - Arguments to update one VendorReport.
     * @example
     * // Update one VendorReport
     * const vendorReport = await prisma.vendorReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorReportUpdateArgs>(args: SelectSubset<T, VendorReportUpdateArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VendorReports.
     * @param {VendorReportDeleteManyArgs} args - Arguments to filter VendorReports to delete.
     * @example
     * // Delete a few VendorReports
     * const { count } = await prisma.vendorReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorReportDeleteManyArgs>(args?: SelectSubset<T, VendorReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VendorReports
     * const vendorReport = await prisma.vendorReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorReportUpdateManyArgs>(args: SelectSubset<T, VendorReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorReports and returns the data updated in the database.
     * @param {VendorReportUpdateManyAndReturnArgs} args - Arguments to update many VendorReports.
     * @example
     * // Update many VendorReports
     * const vendorReport = await prisma.vendorReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VendorReports and only return the `id`
     * const vendorReportWithIdOnly = await prisma.vendorReport.updateManyAndReturn({
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
    updateManyAndReturn<T extends VendorReportUpdateManyAndReturnArgs>(args: SelectSubset<T, VendorReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VendorReport.
     * @param {VendorReportUpsertArgs} args - Arguments to update or create a VendorReport.
     * @example
     * // Update or create a VendorReport
     * const vendorReport = await prisma.vendorReport.upsert({
     *   create: {
     *     // ... data to create a VendorReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VendorReport we want to update
     *   }
     * })
     */
    upsert<T extends VendorReportUpsertArgs>(args: SelectSubset<T, VendorReportUpsertArgs<ExtArgs>>): Prisma__VendorReportClient<$Result.GetResult<Prisma.$VendorReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VendorReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportCountArgs} args - Arguments to filter VendorReports to count.
     * @example
     * // Count the number of VendorReports
     * const count = await prisma.vendorReport.count({
     *   where: {
     *     // ... the filter for the VendorReports we want to count
     *   }
     * })
    **/
    count<T extends VendorReportCountArgs>(
      args?: Subset<T, VendorReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VendorReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VendorReportAggregateArgs>(args: Subset<T, VendorReportAggregateArgs>): Prisma.PrismaPromise<GetVendorReportAggregateType<T>>

    /**
     * Group by VendorReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorReportGroupByArgs} args - Group by arguments.
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
      T extends VendorReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorReportGroupByArgs['orderBy'] }
        : { orderBy?: VendorReportGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VendorReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VendorReport model
   */
  readonly fields: VendorReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VendorReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the VendorReport model
   */
  interface VendorReportFieldRefs {
    readonly id: FieldRef<"VendorReport", 'String'>
    readonly vendorId: FieldRef<"VendorReport", 'String'>
    readonly date: FieldRef<"VendorReport", 'DateTime'>
    readonly totalOrders: FieldRef<"VendorReport", 'Int'>
    readonly totalRevenue: FieldRef<"VendorReport", 'Decimal'>
    readonly totalItems: FieldRef<"VendorReport", 'Int'>
    readonly commission: FieldRef<"VendorReport", 'Decimal'>
    readonly netRevenue: FieldRef<"VendorReport", 'Decimal'>
    readonly productViews: FieldRef<"VendorReport", 'Int'>
    readonly productClickRate: FieldRef<"VendorReport", 'Float'>
    readonly conversionRate: FieldRef<"VendorReport", 'Float'>
    readonly averageRating: FieldRef<"VendorReport", 'Float'>
    readonly newReviews: FieldRef<"VendorReport", 'Int'>
    readonly createdAt: FieldRef<"VendorReport", 'DateTime'>
    readonly updatedAt: FieldRef<"VendorReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VendorReport findUnique
   */
  export type VendorReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * Filter, which VendorReport to fetch.
     */
    where: VendorReportWhereUniqueInput
  }

  /**
   * VendorReport findUniqueOrThrow
   */
  export type VendorReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * Filter, which VendorReport to fetch.
     */
    where: VendorReportWhereUniqueInput
  }

  /**
   * VendorReport findFirst
   */
  export type VendorReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * Filter, which VendorReport to fetch.
     */
    where?: VendorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReports to fetch.
     */
    orderBy?: VendorReportOrderByWithRelationInput | VendorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorReports.
     */
    cursor?: VendorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorReports.
     */
    distinct?: VendorReportScalarFieldEnum | VendorReportScalarFieldEnum[]
  }

  /**
   * VendorReport findFirstOrThrow
   */
  export type VendorReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * Filter, which VendorReport to fetch.
     */
    where?: VendorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReports to fetch.
     */
    orderBy?: VendorReportOrderByWithRelationInput | VendorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorReports.
     */
    cursor?: VendorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorReports.
     */
    distinct?: VendorReportScalarFieldEnum | VendorReportScalarFieldEnum[]
  }

  /**
   * VendorReport findMany
   */
  export type VendorReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * Filter, which VendorReports to fetch.
     */
    where?: VendorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorReports to fetch.
     */
    orderBy?: VendorReportOrderByWithRelationInput | VendorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VendorReports.
     */
    cursor?: VendorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorReports.
     */
    distinct?: VendorReportScalarFieldEnum | VendorReportScalarFieldEnum[]
  }

  /**
   * VendorReport create
   */
  export type VendorReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * The data needed to create a VendorReport.
     */
    data: XOR<VendorReportCreateInput, VendorReportUncheckedCreateInput>
  }

  /**
   * VendorReport createMany
   */
  export type VendorReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VendorReports.
     */
    data: VendorReportCreateManyInput | VendorReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VendorReport createManyAndReturn
   */
  export type VendorReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * The data used to create many VendorReports.
     */
    data: VendorReportCreateManyInput | VendorReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VendorReport update
   */
  export type VendorReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * The data needed to update a VendorReport.
     */
    data: XOR<VendorReportUpdateInput, VendorReportUncheckedUpdateInput>
    /**
     * Choose, which VendorReport to update.
     */
    where: VendorReportWhereUniqueInput
  }

  /**
   * VendorReport updateMany
   */
  export type VendorReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VendorReports.
     */
    data: XOR<VendorReportUpdateManyMutationInput, VendorReportUncheckedUpdateManyInput>
    /**
     * Filter which VendorReports to update
     */
    where?: VendorReportWhereInput
    /**
     * Limit how many VendorReports to update.
     */
    limit?: number
  }

  /**
   * VendorReport updateManyAndReturn
   */
  export type VendorReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * The data used to update VendorReports.
     */
    data: XOR<VendorReportUpdateManyMutationInput, VendorReportUncheckedUpdateManyInput>
    /**
     * Filter which VendorReports to update
     */
    where?: VendorReportWhereInput
    /**
     * Limit how many VendorReports to update.
     */
    limit?: number
  }

  /**
   * VendorReport upsert
   */
  export type VendorReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * The filter to search for the VendorReport to update in case it exists.
     */
    where: VendorReportWhereUniqueInput
    /**
     * In case the VendorReport found by the `where` argument doesn't exist, create a new VendorReport with this data.
     */
    create: XOR<VendorReportCreateInput, VendorReportUncheckedCreateInput>
    /**
     * In case the VendorReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorReportUpdateInput, VendorReportUncheckedUpdateInput>
  }

  /**
   * VendorReport delete
   */
  export type VendorReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
    /**
     * Filter which VendorReport to delete.
     */
    where: VendorReportWhereUniqueInput
  }

  /**
   * VendorReport deleteMany
   */
  export type VendorReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorReports to delete
     */
    where?: VendorReportWhereInput
    /**
     * Limit how many VendorReports to delete.
     */
    limit?: number
  }

  /**
   * VendorReport without action
   */
  export type VendorReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorReport
     */
    select?: VendorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VendorReport
     */
    omit?: VendorReportOmit<ExtArgs> | null
  }


  /**
   * Model ProductAnalytics
   */

  export type AggregateProductAnalytics = {
    _count: ProductAnalyticsCountAggregateOutputType | null
    _avg: ProductAnalyticsAvgAggregateOutputType | null
    _sum: ProductAnalyticsSumAggregateOutputType | null
    _min: ProductAnalyticsMinAggregateOutputType | null
    _max: ProductAnalyticsMaxAggregateOutputType | null
  }

  export type ProductAnalyticsAvgAggregateOutputType = {
    views: number | null
    uniqueViews: number | null
    addToCart: number | null
    purchases: number | null
    revenue: Decimal | null
    conversionRate: number | null
    bounceRate: number | null
    searchImpressions: number | null
    searchClicks: number | null
  }

  export type ProductAnalyticsSumAggregateOutputType = {
    views: number | null
    uniqueViews: number | null
    addToCart: number | null
    purchases: number | null
    revenue: Decimal | null
    conversionRate: number | null
    bounceRate: number | null
    searchImpressions: number | null
    searchClicks: number | null
  }

  export type ProductAnalyticsMinAggregateOutputType = {
    id: string | null
    productId: string | null
    date: Date | null
    views: number | null
    uniqueViews: number | null
    addToCart: number | null
    purchases: number | null
    revenue: Decimal | null
    conversionRate: number | null
    bounceRate: number | null
    searchImpressions: number | null
    searchClicks: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductAnalyticsMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    date: Date | null
    views: number | null
    uniqueViews: number | null
    addToCart: number | null
    purchases: number | null
    revenue: Decimal | null
    conversionRate: number | null
    bounceRate: number | null
    searchImpressions: number | null
    searchClicks: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductAnalyticsCountAggregateOutputType = {
    id: number
    productId: number
    date: number
    views: number
    uniqueViews: number
    addToCart: number
    purchases: number
    revenue: number
    conversionRate: number
    bounceRate: number
    searchImpressions: number
    searchClicks: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAnalyticsAvgAggregateInputType = {
    views?: true
    uniqueViews?: true
    addToCart?: true
    purchases?: true
    revenue?: true
    conversionRate?: true
    bounceRate?: true
    searchImpressions?: true
    searchClicks?: true
  }

  export type ProductAnalyticsSumAggregateInputType = {
    views?: true
    uniqueViews?: true
    addToCart?: true
    purchases?: true
    revenue?: true
    conversionRate?: true
    bounceRate?: true
    searchImpressions?: true
    searchClicks?: true
  }

  export type ProductAnalyticsMinAggregateInputType = {
    id?: true
    productId?: true
    date?: true
    views?: true
    uniqueViews?: true
    addToCart?: true
    purchases?: true
    revenue?: true
    conversionRate?: true
    bounceRate?: true
    searchImpressions?: true
    searchClicks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductAnalyticsMaxAggregateInputType = {
    id?: true
    productId?: true
    date?: true
    views?: true
    uniqueViews?: true
    addToCart?: true
    purchases?: true
    revenue?: true
    conversionRate?: true
    bounceRate?: true
    searchImpressions?: true
    searchClicks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductAnalyticsCountAggregateInputType = {
    id?: true
    productId?: true
    date?: true
    views?: true
    uniqueViews?: true
    addToCart?: true
    purchases?: true
    revenue?: true
    conversionRate?: true
    bounceRate?: true
    searchImpressions?: true
    searchClicks?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductAnalytics to aggregate.
     */
    where?: ProductAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAnalytics to fetch.
     */
    orderBy?: ProductAnalyticsOrderByWithRelationInput | ProductAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductAnalytics
    **/
    _count?: true | ProductAnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductAnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductAnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductAnalyticsMaxAggregateInputType
  }

  export type GetProductAnalyticsAggregateType<T extends ProductAnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateProductAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductAnalytics[P]>
      : GetScalarType<T[P], AggregateProductAnalytics[P]>
  }




  export type ProductAnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductAnalyticsWhereInput
    orderBy?: ProductAnalyticsOrderByWithAggregationInput | ProductAnalyticsOrderByWithAggregationInput[]
    by: ProductAnalyticsScalarFieldEnum[] | ProductAnalyticsScalarFieldEnum
    having?: ProductAnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductAnalyticsCountAggregateInputType | true
    _avg?: ProductAnalyticsAvgAggregateInputType
    _sum?: ProductAnalyticsSumAggregateInputType
    _min?: ProductAnalyticsMinAggregateInputType
    _max?: ProductAnalyticsMaxAggregateInputType
  }

  export type ProductAnalyticsGroupByOutputType = {
    id: string
    productId: string
    date: Date
    views: number
    uniqueViews: number
    addToCart: number
    purchases: number
    revenue: Decimal
    conversionRate: number
    bounceRate: number
    searchImpressions: number
    searchClicks: number
    createdAt: Date
    updatedAt: Date
    _count: ProductAnalyticsCountAggregateOutputType | null
    _avg: ProductAnalyticsAvgAggregateOutputType | null
    _sum: ProductAnalyticsSumAggregateOutputType | null
    _min: ProductAnalyticsMinAggregateOutputType | null
    _max: ProductAnalyticsMaxAggregateOutputType | null
  }

  type GetProductAnalyticsGroupByPayload<T extends ProductAnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductAnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductAnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], ProductAnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type ProductAnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    date?: boolean
    views?: boolean
    uniqueViews?: boolean
    addToCart?: boolean
    purchases?: boolean
    revenue?: boolean
    conversionRate?: boolean
    bounceRate?: boolean
    searchImpressions?: boolean
    searchClicks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["productAnalytics"]>

  export type ProductAnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    date?: boolean
    views?: boolean
    uniqueViews?: boolean
    addToCart?: boolean
    purchases?: boolean
    revenue?: boolean
    conversionRate?: boolean
    bounceRate?: boolean
    searchImpressions?: boolean
    searchClicks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["productAnalytics"]>

  export type ProductAnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    date?: boolean
    views?: boolean
    uniqueViews?: boolean
    addToCart?: boolean
    purchases?: boolean
    revenue?: boolean
    conversionRate?: boolean
    bounceRate?: boolean
    searchImpressions?: boolean
    searchClicks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["productAnalytics"]>

  export type ProductAnalyticsSelectScalar = {
    id?: boolean
    productId?: boolean
    date?: boolean
    views?: boolean
    uniqueViews?: boolean
    addToCart?: boolean
    purchases?: boolean
    revenue?: boolean
    conversionRate?: boolean
    bounceRate?: boolean
    searchImpressions?: boolean
    searchClicks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductAnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "date" | "views" | "uniqueViews" | "addToCart" | "purchases" | "revenue" | "conversionRate" | "bounceRate" | "searchImpressions" | "searchClicks" | "createdAt" | "updatedAt", ExtArgs["result"]["productAnalytics"]>

  export type $ProductAnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductAnalytics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      date: Date
      views: number
      uniqueViews: number
      addToCart: number
      purchases: number
      revenue: Prisma.Decimal
      conversionRate: number
      bounceRate: number
      searchImpressions: number
      searchClicks: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["productAnalytics"]>
    composites: {}
  }

  type ProductAnalyticsGetPayload<S extends boolean | null | undefined | ProductAnalyticsDefaultArgs> = $Result.GetResult<Prisma.$ProductAnalyticsPayload, S>

  type ProductAnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductAnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductAnalyticsCountAggregateInputType | true
    }

  export interface ProductAnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductAnalytics'], meta: { name: 'ProductAnalytics' } }
    /**
     * Find zero or one ProductAnalytics that matches the filter.
     * @param {ProductAnalyticsFindUniqueArgs} args - Arguments to find a ProductAnalytics
     * @example
     * // Get one ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductAnalyticsFindUniqueArgs>(args: SelectSubset<T, ProductAnalyticsFindUniqueArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a ProductAnalytics
     * @example
     * // Get one ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductAnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductAnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsFindFirstArgs} args - Arguments to find a ProductAnalytics
     * @example
     * // Get one ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductAnalyticsFindFirstArgs>(args?: SelectSubset<T, ProductAnalyticsFindFirstArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsFindFirstOrThrowArgs} args - Arguments to find a ProductAnalytics
     * @example
     * // Get one ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductAnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductAnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.findMany()
     * 
     * // Get first 10 ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productAnalyticsWithIdOnly = await prisma.productAnalytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductAnalyticsFindManyArgs>(args?: SelectSubset<T, ProductAnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductAnalytics.
     * @param {ProductAnalyticsCreateArgs} args - Arguments to create a ProductAnalytics.
     * @example
     * // Create one ProductAnalytics
     * const ProductAnalytics = await prisma.productAnalytics.create({
     *   data: {
     *     // ... data to create a ProductAnalytics
     *   }
     * })
     * 
     */
    create<T extends ProductAnalyticsCreateArgs>(args: SelectSubset<T, ProductAnalyticsCreateArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductAnalytics.
     * @param {ProductAnalyticsCreateManyArgs} args - Arguments to create many ProductAnalytics.
     * @example
     * // Create many ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductAnalyticsCreateManyArgs>(args?: SelectSubset<T, ProductAnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductAnalytics and returns the data saved in the database.
     * @param {ProductAnalyticsCreateManyAndReturnArgs} args - Arguments to create many ProductAnalytics.
     * @example
     * // Create many ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductAnalytics and only return the `id`
     * const productAnalyticsWithIdOnly = await prisma.productAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductAnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductAnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductAnalytics.
     * @param {ProductAnalyticsDeleteArgs} args - Arguments to delete one ProductAnalytics.
     * @example
     * // Delete one ProductAnalytics
     * const ProductAnalytics = await prisma.productAnalytics.delete({
     *   where: {
     *     // ... filter to delete one ProductAnalytics
     *   }
     * })
     * 
     */
    delete<T extends ProductAnalyticsDeleteArgs>(args: SelectSubset<T, ProductAnalyticsDeleteArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductAnalytics.
     * @param {ProductAnalyticsUpdateArgs} args - Arguments to update one ProductAnalytics.
     * @example
     * // Update one ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductAnalyticsUpdateArgs>(args: SelectSubset<T, ProductAnalyticsUpdateArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductAnalytics.
     * @param {ProductAnalyticsDeleteManyArgs} args - Arguments to filter ProductAnalytics to delete.
     * @example
     * // Delete a few ProductAnalytics
     * const { count } = await prisma.productAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductAnalyticsDeleteManyArgs>(args?: SelectSubset<T, ProductAnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductAnalyticsUpdateManyArgs>(args: SelectSubset<T, ProductAnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductAnalytics and returns the data updated in the database.
     * @param {ProductAnalyticsUpdateManyAndReturnArgs} args - Arguments to update many ProductAnalytics.
     * @example
     * // Update many ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductAnalytics and only return the `id`
     * const productAnalyticsWithIdOnly = await prisma.productAnalytics.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductAnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductAnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductAnalytics.
     * @param {ProductAnalyticsUpsertArgs} args - Arguments to update or create a ProductAnalytics.
     * @example
     * // Update or create a ProductAnalytics
     * const productAnalytics = await prisma.productAnalytics.upsert({
     *   create: {
     *     // ... data to create a ProductAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends ProductAnalyticsUpsertArgs>(args: SelectSubset<T, ProductAnalyticsUpsertArgs<ExtArgs>>): Prisma__ProductAnalyticsClient<$Result.GetResult<Prisma.$ProductAnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsCountArgs} args - Arguments to filter ProductAnalytics to count.
     * @example
     * // Count the number of ProductAnalytics
     * const count = await prisma.productAnalytics.count({
     *   where: {
     *     // ... the filter for the ProductAnalytics we want to count
     *   }
     * })
    **/
    count<T extends ProductAnalyticsCountArgs>(
      args?: Subset<T, ProductAnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductAnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductAnalyticsAggregateArgs>(args: Subset<T, ProductAnalyticsAggregateArgs>): Prisma.PrismaPromise<GetProductAnalyticsAggregateType<T>>

    /**
     * Group by ProductAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAnalyticsGroupByArgs} args - Group by arguments.
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
      T extends ProductAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: ProductAnalyticsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductAnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductAnalytics model
   */
  readonly fields: ProductAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductAnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the ProductAnalytics model
   */
  interface ProductAnalyticsFieldRefs {
    readonly id: FieldRef<"ProductAnalytics", 'String'>
    readonly productId: FieldRef<"ProductAnalytics", 'String'>
    readonly date: FieldRef<"ProductAnalytics", 'DateTime'>
    readonly views: FieldRef<"ProductAnalytics", 'Int'>
    readonly uniqueViews: FieldRef<"ProductAnalytics", 'Int'>
    readonly addToCart: FieldRef<"ProductAnalytics", 'Int'>
    readonly purchases: FieldRef<"ProductAnalytics", 'Int'>
    readonly revenue: FieldRef<"ProductAnalytics", 'Decimal'>
    readonly conversionRate: FieldRef<"ProductAnalytics", 'Float'>
    readonly bounceRate: FieldRef<"ProductAnalytics", 'Float'>
    readonly searchImpressions: FieldRef<"ProductAnalytics", 'Int'>
    readonly searchClicks: FieldRef<"ProductAnalytics", 'Int'>
    readonly createdAt: FieldRef<"ProductAnalytics", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductAnalytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductAnalytics findUnique
   */
  export type ProductAnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which ProductAnalytics to fetch.
     */
    where: ProductAnalyticsWhereUniqueInput
  }

  /**
   * ProductAnalytics findUniqueOrThrow
   */
  export type ProductAnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which ProductAnalytics to fetch.
     */
    where: ProductAnalyticsWhereUniqueInput
  }

  /**
   * ProductAnalytics findFirst
   */
  export type ProductAnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which ProductAnalytics to fetch.
     */
    where?: ProductAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAnalytics to fetch.
     */
    orderBy?: ProductAnalyticsOrderByWithRelationInput | ProductAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductAnalytics.
     */
    cursor?: ProductAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductAnalytics.
     */
    distinct?: ProductAnalyticsScalarFieldEnum | ProductAnalyticsScalarFieldEnum[]
  }

  /**
   * ProductAnalytics findFirstOrThrow
   */
  export type ProductAnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which ProductAnalytics to fetch.
     */
    where?: ProductAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAnalytics to fetch.
     */
    orderBy?: ProductAnalyticsOrderByWithRelationInput | ProductAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductAnalytics.
     */
    cursor?: ProductAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductAnalytics.
     */
    distinct?: ProductAnalyticsScalarFieldEnum | ProductAnalyticsScalarFieldEnum[]
  }

  /**
   * ProductAnalytics findMany
   */
  export type ProductAnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which ProductAnalytics to fetch.
     */
    where?: ProductAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAnalytics to fetch.
     */
    orderBy?: ProductAnalyticsOrderByWithRelationInput | ProductAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductAnalytics.
     */
    cursor?: ProductAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductAnalytics.
     */
    distinct?: ProductAnalyticsScalarFieldEnum | ProductAnalyticsScalarFieldEnum[]
  }

  /**
   * ProductAnalytics create
   */
  export type ProductAnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to create a ProductAnalytics.
     */
    data: XOR<ProductAnalyticsCreateInput, ProductAnalyticsUncheckedCreateInput>
  }

  /**
   * ProductAnalytics createMany
   */
  export type ProductAnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductAnalytics.
     */
    data: ProductAnalyticsCreateManyInput | ProductAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductAnalytics createManyAndReturn
   */
  export type ProductAnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many ProductAnalytics.
     */
    data: ProductAnalyticsCreateManyInput | ProductAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductAnalytics update
   */
  export type ProductAnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to update a ProductAnalytics.
     */
    data: XOR<ProductAnalyticsUpdateInput, ProductAnalyticsUncheckedUpdateInput>
    /**
     * Choose, which ProductAnalytics to update.
     */
    where: ProductAnalyticsWhereUniqueInput
  }

  /**
   * ProductAnalytics updateMany
   */
  export type ProductAnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductAnalytics.
     */
    data: XOR<ProductAnalyticsUpdateManyMutationInput, ProductAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which ProductAnalytics to update
     */
    where?: ProductAnalyticsWhereInput
    /**
     * Limit how many ProductAnalytics to update.
     */
    limit?: number
  }

  /**
   * ProductAnalytics updateManyAndReturn
   */
  export type ProductAnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update ProductAnalytics.
     */
    data: XOR<ProductAnalyticsUpdateManyMutationInput, ProductAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which ProductAnalytics to update
     */
    where?: ProductAnalyticsWhereInput
    /**
     * Limit how many ProductAnalytics to update.
     */
    limit?: number
  }

  /**
   * ProductAnalytics upsert
   */
  export type ProductAnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * The filter to search for the ProductAnalytics to update in case it exists.
     */
    where: ProductAnalyticsWhereUniqueInput
    /**
     * In case the ProductAnalytics found by the `where` argument doesn't exist, create a new ProductAnalytics with this data.
     */
    create: XOR<ProductAnalyticsCreateInput, ProductAnalyticsUncheckedCreateInput>
    /**
     * In case the ProductAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductAnalyticsUpdateInput, ProductAnalyticsUncheckedUpdateInput>
  }

  /**
   * ProductAnalytics delete
   */
  export type ProductAnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
    /**
     * Filter which ProductAnalytics to delete.
     */
    where: ProductAnalyticsWhereUniqueInput
  }

  /**
   * ProductAnalytics deleteMany
   */
  export type ProductAnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductAnalytics to delete
     */
    where?: ProductAnalyticsWhereInput
    /**
     * Limit how many ProductAnalytics to delete.
     */
    limit?: number
  }

  /**
   * ProductAnalytics without action
   */
  export type ProductAnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAnalytics
     */
    select?: ProductAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductAnalytics
     */
    omit?: ProductAnalyticsOmit<ExtArgs> | null
  }


  /**
   * Model CategoryAnalytics
   */

  export type AggregateCategoryAnalytics = {
    _count: CategoryAnalyticsCountAggregateOutputType | null
    _avg: CategoryAnalyticsAvgAggregateOutputType | null
    _sum: CategoryAnalyticsSumAggregateOutputType | null
    _min: CategoryAnalyticsMinAggregateOutputType | null
    _max: CategoryAnalyticsMaxAggregateOutputType | null
  }

  export type CategoryAnalyticsAvgAggregateOutputType = {
    views: number | null
    productViews: number | null
    purchases: number | null
    revenue: Decimal | null
  }

  export type CategoryAnalyticsSumAggregateOutputType = {
    views: number | null
    productViews: number | null
    purchases: number | null
    revenue: Decimal | null
  }

  export type CategoryAnalyticsMinAggregateOutputType = {
    id: string | null
    categoryId: string | null
    date: Date | null
    views: number | null
    productViews: number | null
    purchases: number | null
    revenue: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryAnalyticsMaxAggregateOutputType = {
    id: string | null
    categoryId: string | null
    date: Date | null
    views: number | null
    productViews: number | null
    purchases: number | null
    revenue: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryAnalyticsCountAggregateOutputType = {
    id: number
    categoryId: number
    date: number
    views: number
    productViews: number
    purchases: number
    revenue: number
    topProductIds: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryAnalyticsAvgAggregateInputType = {
    views?: true
    productViews?: true
    purchases?: true
    revenue?: true
  }

  export type CategoryAnalyticsSumAggregateInputType = {
    views?: true
    productViews?: true
    purchases?: true
    revenue?: true
  }

  export type CategoryAnalyticsMinAggregateInputType = {
    id?: true
    categoryId?: true
    date?: true
    views?: true
    productViews?: true
    purchases?: true
    revenue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryAnalyticsMaxAggregateInputType = {
    id?: true
    categoryId?: true
    date?: true
    views?: true
    productViews?: true
    purchases?: true
    revenue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryAnalyticsCountAggregateInputType = {
    id?: true
    categoryId?: true
    date?: true
    views?: true
    productViews?: true
    purchases?: true
    revenue?: true
    topProductIds?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryAnalytics to aggregate.
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryAnalytics to fetch.
     */
    orderBy?: CategoryAnalyticsOrderByWithRelationInput | CategoryAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CategoryAnalytics
    **/
    _count?: true | CategoryAnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategoryAnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryAnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryAnalyticsMaxAggregateInputType
  }

  export type GetCategoryAnalyticsAggregateType<T extends CategoryAnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoryAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoryAnalytics[P]>
      : GetScalarType<T[P], AggregateCategoryAnalytics[P]>
  }




  export type CategoryAnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryAnalyticsWhereInput
    orderBy?: CategoryAnalyticsOrderByWithAggregationInput | CategoryAnalyticsOrderByWithAggregationInput[]
    by: CategoryAnalyticsScalarFieldEnum[] | CategoryAnalyticsScalarFieldEnum
    having?: CategoryAnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryAnalyticsCountAggregateInputType | true
    _avg?: CategoryAnalyticsAvgAggregateInputType
    _sum?: CategoryAnalyticsSumAggregateInputType
    _min?: CategoryAnalyticsMinAggregateInputType
    _max?: CategoryAnalyticsMaxAggregateInputType
  }

  export type CategoryAnalyticsGroupByOutputType = {
    id: string
    categoryId: string
    date: Date
    views: number
    productViews: number
    purchases: number
    revenue: Decimal
    topProductIds: string[]
    createdAt: Date
    updatedAt: Date
    _count: CategoryAnalyticsCountAggregateOutputType | null
    _avg: CategoryAnalyticsAvgAggregateOutputType | null
    _sum: CategoryAnalyticsSumAggregateOutputType | null
    _min: CategoryAnalyticsMinAggregateOutputType | null
    _max: CategoryAnalyticsMaxAggregateOutputType | null
  }

  type GetCategoryAnalyticsGroupByPayload<T extends CategoryAnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryAnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryAnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryAnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type CategoryAnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    categoryId?: boolean
    date?: boolean
    views?: boolean
    productViews?: boolean
    purchases?: boolean
    revenue?: boolean
    topProductIds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["categoryAnalytics"]>

  export type CategoryAnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    categoryId?: boolean
    date?: boolean
    views?: boolean
    productViews?: boolean
    purchases?: boolean
    revenue?: boolean
    topProductIds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["categoryAnalytics"]>

  export type CategoryAnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    categoryId?: boolean
    date?: boolean
    views?: boolean
    productViews?: boolean
    purchases?: boolean
    revenue?: boolean
    topProductIds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["categoryAnalytics"]>

  export type CategoryAnalyticsSelectScalar = {
    id?: boolean
    categoryId?: boolean
    date?: boolean
    views?: boolean
    productViews?: boolean
    purchases?: boolean
    revenue?: boolean
    topProductIds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryAnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "categoryId" | "date" | "views" | "productViews" | "purchases" | "revenue" | "topProductIds" | "createdAt" | "updatedAt", ExtArgs["result"]["categoryAnalytics"]>

  export type $CategoryAnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CategoryAnalytics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      categoryId: string
      date: Date
      views: number
      productViews: number
      purchases: number
      revenue: Prisma.Decimal
      topProductIds: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["categoryAnalytics"]>
    composites: {}
  }

  type CategoryAnalyticsGetPayload<S extends boolean | null | undefined | CategoryAnalyticsDefaultArgs> = $Result.GetResult<Prisma.$CategoryAnalyticsPayload, S>

  type CategoryAnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryAnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryAnalyticsCountAggregateInputType | true
    }

  export interface CategoryAnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CategoryAnalytics'], meta: { name: 'CategoryAnalytics' } }
    /**
     * Find zero or one CategoryAnalytics that matches the filter.
     * @param {CategoryAnalyticsFindUniqueArgs} args - Arguments to find a CategoryAnalytics
     * @example
     * // Get one CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryAnalyticsFindUniqueArgs>(args: SelectSubset<T, CategoryAnalyticsFindUniqueArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CategoryAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a CategoryAnalytics
     * @example
     * // Get one CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryAnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryAnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsFindFirstArgs} args - Arguments to find a CategoryAnalytics
     * @example
     * // Get one CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryAnalyticsFindFirstArgs>(args?: SelectSubset<T, CategoryAnalyticsFindFirstArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsFindFirstOrThrowArgs} args - Arguments to find a CategoryAnalytics
     * @example
     * // Get one CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryAnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryAnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CategoryAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.findMany()
     * 
     * // Get first 10 CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryAnalyticsWithIdOnly = await prisma.categoryAnalytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryAnalyticsFindManyArgs>(args?: SelectSubset<T, CategoryAnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CategoryAnalytics.
     * @param {CategoryAnalyticsCreateArgs} args - Arguments to create a CategoryAnalytics.
     * @example
     * // Create one CategoryAnalytics
     * const CategoryAnalytics = await prisma.categoryAnalytics.create({
     *   data: {
     *     // ... data to create a CategoryAnalytics
     *   }
     * })
     * 
     */
    create<T extends CategoryAnalyticsCreateArgs>(args: SelectSubset<T, CategoryAnalyticsCreateArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CategoryAnalytics.
     * @param {CategoryAnalyticsCreateManyArgs} args - Arguments to create many CategoryAnalytics.
     * @example
     * // Create many CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryAnalyticsCreateManyArgs>(args?: SelectSubset<T, CategoryAnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CategoryAnalytics and returns the data saved in the database.
     * @param {CategoryAnalyticsCreateManyAndReturnArgs} args - Arguments to create many CategoryAnalytics.
     * @example
     * // Create many CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CategoryAnalytics and only return the `id`
     * const categoryAnalyticsWithIdOnly = await prisma.categoryAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryAnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryAnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CategoryAnalytics.
     * @param {CategoryAnalyticsDeleteArgs} args - Arguments to delete one CategoryAnalytics.
     * @example
     * // Delete one CategoryAnalytics
     * const CategoryAnalytics = await prisma.categoryAnalytics.delete({
     *   where: {
     *     // ... filter to delete one CategoryAnalytics
     *   }
     * })
     * 
     */
    delete<T extends CategoryAnalyticsDeleteArgs>(args: SelectSubset<T, CategoryAnalyticsDeleteArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CategoryAnalytics.
     * @param {CategoryAnalyticsUpdateArgs} args - Arguments to update one CategoryAnalytics.
     * @example
     * // Update one CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryAnalyticsUpdateArgs>(args: SelectSubset<T, CategoryAnalyticsUpdateArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CategoryAnalytics.
     * @param {CategoryAnalyticsDeleteManyArgs} args - Arguments to filter CategoryAnalytics to delete.
     * @example
     * // Delete a few CategoryAnalytics
     * const { count } = await prisma.categoryAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryAnalyticsDeleteManyArgs>(args?: SelectSubset<T, CategoryAnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryAnalyticsUpdateManyArgs>(args: SelectSubset<T, CategoryAnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryAnalytics and returns the data updated in the database.
     * @param {CategoryAnalyticsUpdateManyAndReturnArgs} args - Arguments to update many CategoryAnalytics.
     * @example
     * // Update many CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CategoryAnalytics and only return the `id`
     * const categoryAnalyticsWithIdOnly = await prisma.categoryAnalytics.updateManyAndReturn({
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
    updateManyAndReturn<T extends CategoryAnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryAnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CategoryAnalytics.
     * @param {CategoryAnalyticsUpsertArgs} args - Arguments to update or create a CategoryAnalytics.
     * @example
     * // Update or create a CategoryAnalytics
     * const categoryAnalytics = await prisma.categoryAnalytics.upsert({
     *   create: {
     *     // ... data to create a CategoryAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CategoryAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends CategoryAnalyticsUpsertArgs>(args: SelectSubset<T, CategoryAnalyticsUpsertArgs<ExtArgs>>): Prisma__CategoryAnalyticsClient<$Result.GetResult<Prisma.$CategoryAnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CategoryAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsCountArgs} args - Arguments to filter CategoryAnalytics to count.
     * @example
     * // Count the number of CategoryAnalytics
     * const count = await prisma.categoryAnalytics.count({
     *   where: {
     *     // ... the filter for the CategoryAnalytics we want to count
     *   }
     * })
    **/
    count<T extends CategoryAnalyticsCountArgs>(
      args?: Subset<T, CategoryAnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryAnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CategoryAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CategoryAnalyticsAggregateArgs>(args: Subset<T, CategoryAnalyticsAggregateArgs>): Prisma.PrismaPromise<GetCategoryAnalyticsAggregateType<T>>

    /**
     * Group by CategoryAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAnalyticsGroupByArgs} args - Group by arguments.
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
      T extends CategoryAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: CategoryAnalyticsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CategoryAnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CategoryAnalytics model
   */
  readonly fields: CategoryAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CategoryAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryAnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the CategoryAnalytics model
   */
  interface CategoryAnalyticsFieldRefs {
    readonly id: FieldRef<"CategoryAnalytics", 'String'>
    readonly categoryId: FieldRef<"CategoryAnalytics", 'String'>
    readonly date: FieldRef<"CategoryAnalytics", 'DateTime'>
    readonly views: FieldRef<"CategoryAnalytics", 'Int'>
    readonly productViews: FieldRef<"CategoryAnalytics", 'Int'>
    readonly purchases: FieldRef<"CategoryAnalytics", 'Int'>
    readonly revenue: FieldRef<"CategoryAnalytics", 'Decimal'>
    readonly topProductIds: FieldRef<"CategoryAnalytics", 'String[]'>
    readonly createdAt: FieldRef<"CategoryAnalytics", 'DateTime'>
    readonly updatedAt: FieldRef<"CategoryAnalytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CategoryAnalytics findUnique
   */
  export type CategoryAnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which CategoryAnalytics to fetch.
     */
    where: CategoryAnalyticsWhereUniqueInput
  }

  /**
   * CategoryAnalytics findUniqueOrThrow
   */
  export type CategoryAnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which CategoryAnalytics to fetch.
     */
    where: CategoryAnalyticsWhereUniqueInput
  }

  /**
   * CategoryAnalytics findFirst
   */
  export type CategoryAnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which CategoryAnalytics to fetch.
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryAnalytics to fetch.
     */
    orderBy?: CategoryAnalyticsOrderByWithRelationInput | CategoryAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryAnalytics.
     */
    cursor?: CategoryAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryAnalytics.
     */
    distinct?: CategoryAnalyticsScalarFieldEnum | CategoryAnalyticsScalarFieldEnum[]
  }

  /**
   * CategoryAnalytics findFirstOrThrow
   */
  export type CategoryAnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which CategoryAnalytics to fetch.
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryAnalytics to fetch.
     */
    orderBy?: CategoryAnalyticsOrderByWithRelationInput | CategoryAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryAnalytics.
     */
    cursor?: CategoryAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryAnalytics.
     */
    distinct?: CategoryAnalyticsScalarFieldEnum | CategoryAnalyticsScalarFieldEnum[]
  }

  /**
   * CategoryAnalytics findMany
   */
  export type CategoryAnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which CategoryAnalytics to fetch.
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryAnalytics to fetch.
     */
    orderBy?: CategoryAnalyticsOrderByWithRelationInput | CategoryAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CategoryAnalytics.
     */
    cursor?: CategoryAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryAnalytics.
     */
    distinct?: CategoryAnalyticsScalarFieldEnum | CategoryAnalyticsScalarFieldEnum[]
  }

  /**
   * CategoryAnalytics create
   */
  export type CategoryAnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to create a CategoryAnalytics.
     */
    data: XOR<CategoryAnalyticsCreateInput, CategoryAnalyticsUncheckedCreateInput>
  }

  /**
   * CategoryAnalytics createMany
   */
  export type CategoryAnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CategoryAnalytics.
     */
    data: CategoryAnalyticsCreateManyInput | CategoryAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CategoryAnalytics createManyAndReturn
   */
  export type CategoryAnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many CategoryAnalytics.
     */
    data: CategoryAnalyticsCreateManyInput | CategoryAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CategoryAnalytics update
   */
  export type CategoryAnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to update a CategoryAnalytics.
     */
    data: XOR<CategoryAnalyticsUpdateInput, CategoryAnalyticsUncheckedUpdateInput>
    /**
     * Choose, which CategoryAnalytics to update.
     */
    where: CategoryAnalyticsWhereUniqueInput
  }

  /**
   * CategoryAnalytics updateMany
   */
  export type CategoryAnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CategoryAnalytics.
     */
    data: XOR<CategoryAnalyticsUpdateManyMutationInput, CategoryAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which CategoryAnalytics to update
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * Limit how many CategoryAnalytics to update.
     */
    limit?: number
  }

  /**
   * CategoryAnalytics updateManyAndReturn
   */
  export type CategoryAnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update CategoryAnalytics.
     */
    data: XOR<CategoryAnalyticsUpdateManyMutationInput, CategoryAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which CategoryAnalytics to update
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * Limit how many CategoryAnalytics to update.
     */
    limit?: number
  }

  /**
   * CategoryAnalytics upsert
   */
  export type CategoryAnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * The filter to search for the CategoryAnalytics to update in case it exists.
     */
    where: CategoryAnalyticsWhereUniqueInput
    /**
     * In case the CategoryAnalytics found by the `where` argument doesn't exist, create a new CategoryAnalytics with this data.
     */
    create: XOR<CategoryAnalyticsCreateInput, CategoryAnalyticsUncheckedCreateInput>
    /**
     * In case the CategoryAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryAnalyticsUpdateInput, CategoryAnalyticsUncheckedUpdateInput>
  }

  /**
   * CategoryAnalytics delete
   */
  export type CategoryAnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
    /**
     * Filter which CategoryAnalytics to delete.
     */
    where: CategoryAnalyticsWhereUniqueInput
  }

  /**
   * CategoryAnalytics deleteMany
   */
  export type CategoryAnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryAnalytics to delete
     */
    where?: CategoryAnalyticsWhereInput
    /**
     * Limit how many CategoryAnalytics to delete.
     */
    limit?: number
  }

  /**
   * CategoryAnalytics without action
   */
  export type CategoryAnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryAnalytics
     */
    select?: CategoryAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryAnalytics
     */
    omit?: CategoryAnalyticsOmit<ExtArgs> | null
  }


  /**
   * Model UserAnalytics
   */

  export type AggregateUserAnalytics = {
    _count: UserAnalyticsCountAggregateOutputType | null
    _avg: UserAnalyticsAvgAggregateOutputType | null
    _sum: UserAnalyticsSumAggregateOutputType | null
    _min: UserAnalyticsMinAggregateOutputType | null
    _max: UserAnalyticsMaxAggregateOutputType | null
  }

  export type UserAnalyticsAvgAggregateOutputType = {
    newRegistrations: number | null
    activeUsers: number | null
    totalSessions: number | null
    avgSessionDuration: number | null
    bounceRate: number | null
    mobileUsers: number | null
    desktopUsers: number | null
  }

  export type UserAnalyticsSumAggregateOutputType = {
    newRegistrations: number | null
    activeUsers: number | null
    totalSessions: number | null
    avgSessionDuration: number | null
    bounceRate: number | null
    mobileUsers: number | null
    desktopUsers: number | null
  }

  export type UserAnalyticsMinAggregateOutputType = {
    id: string | null
    date: Date | null
    newRegistrations: number | null
    activeUsers: number | null
    totalSessions: number | null
    avgSessionDuration: number | null
    bounceRate: number | null
    mobileUsers: number | null
    desktopUsers: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserAnalyticsMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    newRegistrations: number | null
    activeUsers: number | null
    totalSessions: number | null
    avgSessionDuration: number | null
    bounceRate: number | null
    mobileUsers: number | null
    desktopUsers: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserAnalyticsCountAggregateOutputType = {
    id: number
    date: number
    newRegistrations: number
    activeUsers: number
    totalSessions: number
    avgSessionDuration: number
    bounceRate: number
    mobileUsers: number
    desktopUsers: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAnalyticsAvgAggregateInputType = {
    newRegistrations?: true
    activeUsers?: true
    totalSessions?: true
    avgSessionDuration?: true
    bounceRate?: true
    mobileUsers?: true
    desktopUsers?: true
  }

  export type UserAnalyticsSumAggregateInputType = {
    newRegistrations?: true
    activeUsers?: true
    totalSessions?: true
    avgSessionDuration?: true
    bounceRate?: true
    mobileUsers?: true
    desktopUsers?: true
  }

  export type UserAnalyticsMinAggregateInputType = {
    id?: true
    date?: true
    newRegistrations?: true
    activeUsers?: true
    totalSessions?: true
    avgSessionDuration?: true
    bounceRate?: true
    mobileUsers?: true
    desktopUsers?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserAnalyticsMaxAggregateInputType = {
    id?: true
    date?: true
    newRegistrations?: true
    activeUsers?: true
    totalSessions?: true
    avgSessionDuration?: true
    bounceRate?: true
    mobileUsers?: true
    desktopUsers?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserAnalyticsCountAggregateInputType = {
    id?: true
    date?: true
    newRegistrations?: true
    activeUsers?: true
    totalSessions?: true
    avgSessionDuration?: true
    bounceRate?: true
    mobileUsers?: true
    desktopUsers?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAnalytics to aggregate.
     */
    where?: UserAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnalytics to fetch.
     */
    orderBy?: UserAnalyticsOrderByWithRelationInput | UserAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAnalytics
    **/
    _count?: true | UserAnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserAnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAnalyticsMaxAggregateInputType
  }

  export type GetUserAnalyticsAggregateType<T extends UserAnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAnalytics[P]>
      : GetScalarType<T[P], AggregateUserAnalytics[P]>
  }




  export type UserAnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAnalyticsWhereInput
    orderBy?: UserAnalyticsOrderByWithAggregationInput | UserAnalyticsOrderByWithAggregationInput[]
    by: UserAnalyticsScalarFieldEnum[] | UserAnalyticsScalarFieldEnum
    having?: UserAnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAnalyticsCountAggregateInputType | true
    _avg?: UserAnalyticsAvgAggregateInputType
    _sum?: UserAnalyticsSumAggregateInputType
    _min?: UserAnalyticsMinAggregateInputType
    _max?: UserAnalyticsMaxAggregateInputType
  }

  export type UserAnalyticsGroupByOutputType = {
    id: string
    date: Date
    newRegistrations: number
    activeUsers: number
    totalSessions: number
    avgSessionDuration: number
    bounceRate: number
    mobileUsers: number
    desktopUsers: number
    createdAt: Date
    updatedAt: Date
    _count: UserAnalyticsCountAggregateOutputType | null
    _avg: UserAnalyticsAvgAggregateOutputType | null
    _sum: UserAnalyticsSumAggregateOutputType | null
    _min: UserAnalyticsMinAggregateOutputType | null
    _max: UserAnalyticsMaxAggregateOutputType | null
  }

  type GetUserAnalyticsGroupByPayload<T extends UserAnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], UserAnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type UserAnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    newRegistrations?: boolean
    activeUsers?: boolean
    totalSessions?: boolean
    avgSessionDuration?: boolean
    bounceRate?: boolean
    mobileUsers?: boolean
    desktopUsers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userAnalytics"]>

  export type UserAnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    newRegistrations?: boolean
    activeUsers?: boolean
    totalSessions?: boolean
    avgSessionDuration?: boolean
    bounceRate?: boolean
    mobileUsers?: boolean
    desktopUsers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userAnalytics"]>

  export type UserAnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    newRegistrations?: boolean
    activeUsers?: boolean
    totalSessions?: boolean
    avgSessionDuration?: boolean
    bounceRate?: boolean
    mobileUsers?: boolean
    desktopUsers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userAnalytics"]>

  export type UserAnalyticsSelectScalar = {
    id?: boolean
    date?: boolean
    newRegistrations?: boolean
    activeUsers?: boolean
    totalSessions?: boolean
    avgSessionDuration?: boolean
    bounceRate?: boolean
    mobileUsers?: boolean
    desktopUsers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserAnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "newRegistrations" | "activeUsers" | "totalSessions" | "avgSessionDuration" | "bounceRate" | "mobileUsers" | "desktopUsers" | "createdAt" | "updatedAt", ExtArgs["result"]["userAnalytics"]>

  export type $UserAnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAnalytics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      newRegistrations: number
      activeUsers: number
      totalSessions: number
      avgSessionDuration: number
      bounceRate: number
      mobileUsers: number
      desktopUsers: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userAnalytics"]>
    composites: {}
  }

  type UserAnalyticsGetPayload<S extends boolean | null | undefined | UserAnalyticsDefaultArgs> = $Result.GetResult<Prisma.$UserAnalyticsPayload, S>

  type UserAnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAnalyticsCountAggregateInputType | true
    }

  export interface UserAnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAnalytics'], meta: { name: 'UserAnalytics' } }
    /**
     * Find zero or one UserAnalytics that matches the filter.
     * @param {UserAnalyticsFindUniqueArgs} args - Arguments to find a UserAnalytics
     * @example
     * // Get one UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAnalyticsFindUniqueArgs>(args: SelectSubset<T, UserAnalyticsFindUniqueArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a UserAnalytics
     * @example
     * // Get one UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsFindFirstArgs} args - Arguments to find a UserAnalytics
     * @example
     * // Get one UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAnalyticsFindFirstArgs>(args?: SelectSubset<T, UserAnalyticsFindFirstArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsFindFirstOrThrowArgs} args - Arguments to find a UserAnalytics
     * @example
     * // Get one UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.findMany()
     * 
     * // Get first 10 UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAnalyticsWithIdOnly = await prisma.userAnalytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAnalyticsFindManyArgs>(args?: SelectSubset<T, UserAnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAnalytics.
     * @param {UserAnalyticsCreateArgs} args - Arguments to create a UserAnalytics.
     * @example
     * // Create one UserAnalytics
     * const UserAnalytics = await prisma.userAnalytics.create({
     *   data: {
     *     // ... data to create a UserAnalytics
     *   }
     * })
     * 
     */
    create<T extends UserAnalyticsCreateArgs>(args: SelectSubset<T, UserAnalyticsCreateArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAnalytics.
     * @param {UserAnalyticsCreateManyArgs} args - Arguments to create many UserAnalytics.
     * @example
     * // Create many UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAnalyticsCreateManyArgs>(args?: SelectSubset<T, UserAnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAnalytics and returns the data saved in the database.
     * @param {UserAnalyticsCreateManyAndReturnArgs} args - Arguments to create many UserAnalytics.
     * @example
     * // Create many UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAnalytics and only return the `id`
     * const userAnalyticsWithIdOnly = await prisma.userAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAnalytics.
     * @param {UserAnalyticsDeleteArgs} args - Arguments to delete one UserAnalytics.
     * @example
     * // Delete one UserAnalytics
     * const UserAnalytics = await prisma.userAnalytics.delete({
     *   where: {
     *     // ... filter to delete one UserAnalytics
     *   }
     * })
     * 
     */
    delete<T extends UserAnalyticsDeleteArgs>(args: SelectSubset<T, UserAnalyticsDeleteArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAnalytics.
     * @param {UserAnalyticsUpdateArgs} args - Arguments to update one UserAnalytics.
     * @example
     * // Update one UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAnalyticsUpdateArgs>(args: SelectSubset<T, UserAnalyticsUpdateArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAnalytics.
     * @param {UserAnalyticsDeleteManyArgs} args - Arguments to filter UserAnalytics to delete.
     * @example
     * // Delete a few UserAnalytics
     * const { count } = await prisma.userAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAnalyticsDeleteManyArgs>(args?: SelectSubset<T, UserAnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAnalyticsUpdateManyArgs>(args: SelectSubset<T, UserAnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAnalytics and returns the data updated in the database.
     * @param {UserAnalyticsUpdateManyAndReturnArgs} args - Arguments to update many UserAnalytics.
     * @example
     * // Update many UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAnalytics and only return the `id`
     * const userAnalyticsWithIdOnly = await prisma.userAnalytics.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserAnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAnalytics.
     * @param {UserAnalyticsUpsertArgs} args - Arguments to update or create a UserAnalytics.
     * @example
     * // Update or create a UserAnalytics
     * const userAnalytics = await prisma.userAnalytics.upsert({
     *   create: {
     *     // ... data to create a UserAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends UserAnalyticsUpsertArgs>(args: SelectSubset<T, UserAnalyticsUpsertArgs<ExtArgs>>): Prisma__UserAnalyticsClient<$Result.GetResult<Prisma.$UserAnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsCountArgs} args - Arguments to filter UserAnalytics to count.
     * @example
     * // Count the number of UserAnalytics
     * const count = await prisma.userAnalytics.count({
     *   where: {
     *     // ... the filter for the UserAnalytics we want to count
     *   }
     * })
    **/
    count<T extends UserAnalyticsCountArgs>(
      args?: Subset<T, UserAnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAnalyticsAggregateArgs>(args: Subset<T, UserAnalyticsAggregateArgs>): Prisma.PrismaPromise<GetUserAnalyticsAggregateType<T>>

    /**
     * Group by UserAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnalyticsGroupByArgs} args - Group by arguments.
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
      T extends UserAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: UserAnalyticsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserAnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAnalytics model
   */
  readonly fields: UserAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the UserAnalytics model
   */
  interface UserAnalyticsFieldRefs {
    readonly id: FieldRef<"UserAnalytics", 'String'>
    readonly date: FieldRef<"UserAnalytics", 'DateTime'>
    readonly newRegistrations: FieldRef<"UserAnalytics", 'Int'>
    readonly activeUsers: FieldRef<"UserAnalytics", 'Int'>
    readonly totalSessions: FieldRef<"UserAnalytics", 'Int'>
    readonly avgSessionDuration: FieldRef<"UserAnalytics", 'Int'>
    readonly bounceRate: FieldRef<"UserAnalytics", 'Float'>
    readonly mobileUsers: FieldRef<"UserAnalytics", 'Int'>
    readonly desktopUsers: FieldRef<"UserAnalytics", 'Int'>
    readonly createdAt: FieldRef<"UserAnalytics", 'DateTime'>
    readonly updatedAt: FieldRef<"UserAnalytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserAnalytics findUnique
   */
  export type UserAnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which UserAnalytics to fetch.
     */
    where: UserAnalyticsWhereUniqueInput
  }

  /**
   * UserAnalytics findUniqueOrThrow
   */
  export type UserAnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which UserAnalytics to fetch.
     */
    where: UserAnalyticsWhereUniqueInput
  }

  /**
   * UserAnalytics findFirst
   */
  export type UserAnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which UserAnalytics to fetch.
     */
    where?: UserAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnalytics to fetch.
     */
    orderBy?: UserAnalyticsOrderByWithRelationInput | UserAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAnalytics.
     */
    cursor?: UserAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAnalytics.
     */
    distinct?: UserAnalyticsScalarFieldEnum | UserAnalyticsScalarFieldEnum[]
  }

  /**
   * UserAnalytics findFirstOrThrow
   */
  export type UserAnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which UserAnalytics to fetch.
     */
    where?: UserAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnalytics to fetch.
     */
    orderBy?: UserAnalyticsOrderByWithRelationInput | UserAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAnalytics.
     */
    cursor?: UserAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAnalytics.
     */
    distinct?: UserAnalyticsScalarFieldEnum | UserAnalyticsScalarFieldEnum[]
  }

  /**
   * UserAnalytics findMany
   */
  export type UserAnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which UserAnalytics to fetch.
     */
    where?: UserAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnalytics to fetch.
     */
    orderBy?: UserAnalyticsOrderByWithRelationInput | UserAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAnalytics.
     */
    cursor?: UserAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAnalytics.
     */
    distinct?: UserAnalyticsScalarFieldEnum | UserAnalyticsScalarFieldEnum[]
  }

  /**
   * UserAnalytics create
   */
  export type UserAnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to create a UserAnalytics.
     */
    data: XOR<UserAnalyticsCreateInput, UserAnalyticsUncheckedCreateInput>
  }

  /**
   * UserAnalytics createMany
   */
  export type UserAnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAnalytics.
     */
    data: UserAnalyticsCreateManyInput | UserAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAnalytics createManyAndReturn
   */
  export type UserAnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many UserAnalytics.
     */
    data: UserAnalyticsCreateManyInput | UserAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAnalytics update
   */
  export type UserAnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to update a UserAnalytics.
     */
    data: XOR<UserAnalyticsUpdateInput, UserAnalyticsUncheckedUpdateInput>
    /**
     * Choose, which UserAnalytics to update.
     */
    where: UserAnalyticsWhereUniqueInput
  }

  /**
   * UserAnalytics updateMany
   */
  export type UserAnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAnalytics.
     */
    data: XOR<UserAnalyticsUpdateManyMutationInput, UserAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which UserAnalytics to update
     */
    where?: UserAnalyticsWhereInput
    /**
     * Limit how many UserAnalytics to update.
     */
    limit?: number
  }

  /**
   * UserAnalytics updateManyAndReturn
   */
  export type UserAnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update UserAnalytics.
     */
    data: XOR<UserAnalyticsUpdateManyMutationInput, UserAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which UserAnalytics to update
     */
    where?: UserAnalyticsWhereInput
    /**
     * Limit how many UserAnalytics to update.
     */
    limit?: number
  }

  /**
   * UserAnalytics upsert
   */
  export type UserAnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * The filter to search for the UserAnalytics to update in case it exists.
     */
    where: UserAnalyticsWhereUniqueInput
    /**
     * In case the UserAnalytics found by the `where` argument doesn't exist, create a new UserAnalytics with this data.
     */
    create: XOR<UserAnalyticsCreateInput, UserAnalyticsUncheckedCreateInput>
    /**
     * In case the UserAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAnalyticsUpdateInput, UserAnalyticsUncheckedUpdateInput>
  }

  /**
   * UserAnalytics delete
   */
  export type UserAnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
    /**
     * Filter which UserAnalytics to delete.
     */
    where: UserAnalyticsWhereUniqueInput
  }

  /**
   * UserAnalytics deleteMany
   */
  export type UserAnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAnalytics to delete
     */
    where?: UserAnalyticsWhereInput
    /**
     * Limit how many UserAnalytics to delete.
     */
    limit?: number
  }

  /**
   * UserAnalytics without action
   */
  export type UserAnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnalytics
     */
    select?: UserAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnalytics
     */
    omit?: UserAnalyticsOmit<ExtArgs> | null
  }


  /**
   * Model EventLog
   */

  export type AggregateEventLog = {
    _count: EventLogCountAggregateOutputType | null
    _min: EventLogMinAggregateOutputType | null
    _max: EventLogMaxAggregateOutputType | null
  }

  export type EventLogMinAggregateOutputType = {
    id: string | null
    eventType: string | null
    eventName: string | null
    userId: string | null
    sessionId: string | null
    entityType: string | null
    entityId: string | null
    ipAddress: string | null
    userAgent: string | null
    referer: string | null
    createdAt: Date | null
  }

  export type EventLogMaxAggregateOutputType = {
    id: string | null
    eventType: string | null
    eventName: string | null
    userId: string | null
    sessionId: string | null
    entityType: string | null
    entityId: string | null
    ipAddress: string | null
    userAgent: string | null
    referer: string | null
    createdAt: Date | null
  }

  export type EventLogCountAggregateOutputType = {
    id: number
    eventType: number
    eventName: number
    userId: number
    sessionId: number
    entityType: number
    entityId: number
    metadata: number
    ipAddress: number
    userAgent: number
    referer: number
    createdAt: number
    _all: number
  }


  export type EventLogMinAggregateInputType = {
    id?: true
    eventType?: true
    eventName?: true
    userId?: true
    sessionId?: true
    entityType?: true
    entityId?: true
    ipAddress?: true
    userAgent?: true
    referer?: true
    createdAt?: true
  }

  export type EventLogMaxAggregateInputType = {
    id?: true
    eventType?: true
    eventName?: true
    userId?: true
    sessionId?: true
    entityType?: true
    entityId?: true
    ipAddress?: true
    userAgent?: true
    referer?: true
    createdAt?: true
  }

  export type EventLogCountAggregateInputType = {
    id?: true
    eventType?: true
    eventName?: true
    userId?: true
    sessionId?: true
    entityType?: true
    entityId?: true
    metadata?: true
    ipAddress?: true
    userAgent?: true
    referer?: true
    createdAt?: true
    _all?: true
  }

  export type EventLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLog to aggregate.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventLogs
    **/
    _count?: true | EventLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventLogMaxAggregateInputType
  }

  export type GetEventLogAggregateType<T extends EventLogAggregateArgs> = {
        [P in keyof T & keyof AggregateEventLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventLog[P]>
      : GetScalarType<T[P], AggregateEventLog[P]>
  }




  export type EventLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventLogWhereInput
    orderBy?: EventLogOrderByWithAggregationInput | EventLogOrderByWithAggregationInput[]
    by: EventLogScalarFieldEnum[] | EventLogScalarFieldEnum
    having?: EventLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventLogCountAggregateInputType | true
    _min?: EventLogMinAggregateInputType
    _max?: EventLogMaxAggregateInputType
  }

  export type EventLogGroupByOutputType = {
    id: string
    eventType: string
    eventName: string
    userId: string | null
    sessionId: string | null
    entityType: string | null
    entityId: string | null
    metadata: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    referer: string | null
    createdAt: Date
    _count: EventLogCountAggregateOutputType | null
    _min: EventLogMinAggregateOutputType | null
    _max: EventLogMaxAggregateOutputType | null
  }

  type GetEventLogGroupByPayload<T extends EventLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventLogGroupByOutputType[P]>
            : GetScalarType<T[P], EventLogGroupByOutputType[P]>
        }
      >
    >


  export type EventLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    eventName?: boolean
    userId?: boolean
    sessionId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    referer?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["eventLog"]>

  export type EventLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    eventName?: boolean
    userId?: boolean
    sessionId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    referer?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["eventLog"]>

  export type EventLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    eventName?: boolean
    userId?: boolean
    sessionId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    referer?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["eventLog"]>

  export type EventLogSelectScalar = {
    id?: boolean
    eventType?: boolean
    eventName?: boolean
    userId?: boolean
    sessionId?: boolean
    entityType?: boolean
    entityId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    referer?: boolean
    createdAt?: boolean
  }

  export type EventLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventType" | "eventName" | "userId" | "sessionId" | "entityType" | "entityId" | "metadata" | "ipAddress" | "userAgent" | "referer" | "createdAt", ExtArgs["result"]["eventLog"]>

  export type $EventLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventType: string
      eventName: string
      userId: string | null
      sessionId: string | null
      entityType: string | null
      entityId: string | null
      metadata: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      referer: string | null
      createdAt: Date
    }, ExtArgs["result"]["eventLog"]>
    composites: {}
  }

  type EventLogGetPayload<S extends boolean | null | undefined | EventLogDefaultArgs> = $Result.GetResult<Prisma.$EventLogPayload, S>

  type EventLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventLogCountAggregateInputType | true
    }

  export interface EventLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventLog'], meta: { name: 'EventLog' } }
    /**
     * Find zero or one EventLog that matches the filter.
     * @param {EventLogFindUniqueArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventLogFindUniqueArgs>(args: SelectSubset<T, EventLogFindUniqueArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventLogFindUniqueOrThrowArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventLogFindUniqueOrThrowArgs>(args: SelectSubset<T, EventLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindFirstArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventLogFindFirstArgs>(args?: SelectSubset<T, EventLogFindFirstArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindFirstOrThrowArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventLogFindFirstOrThrowArgs>(args?: SelectSubset<T, EventLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventLogs
     * const eventLogs = await prisma.eventLog.findMany()
     * 
     * // Get first 10 EventLogs
     * const eventLogs = await prisma.eventLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventLogWithIdOnly = await prisma.eventLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventLogFindManyArgs>(args?: SelectSubset<T, EventLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventLog.
     * @param {EventLogCreateArgs} args - Arguments to create a EventLog.
     * @example
     * // Create one EventLog
     * const EventLog = await prisma.eventLog.create({
     *   data: {
     *     // ... data to create a EventLog
     *   }
     * })
     * 
     */
    create<T extends EventLogCreateArgs>(args: SelectSubset<T, EventLogCreateArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventLogs.
     * @param {EventLogCreateManyArgs} args - Arguments to create many EventLogs.
     * @example
     * // Create many EventLogs
     * const eventLog = await prisma.eventLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventLogCreateManyArgs>(args?: SelectSubset<T, EventLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventLogs and returns the data saved in the database.
     * @param {EventLogCreateManyAndReturnArgs} args - Arguments to create many EventLogs.
     * @example
     * // Create many EventLogs
     * const eventLog = await prisma.eventLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventLogs and only return the `id`
     * const eventLogWithIdOnly = await prisma.eventLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventLogCreateManyAndReturnArgs>(args?: SelectSubset<T, EventLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventLog.
     * @param {EventLogDeleteArgs} args - Arguments to delete one EventLog.
     * @example
     * // Delete one EventLog
     * const EventLog = await prisma.eventLog.delete({
     *   where: {
     *     // ... filter to delete one EventLog
     *   }
     * })
     * 
     */
    delete<T extends EventLogDeleteArgs>(args: SelectSubset<T, EventLogDeleteArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventLog.
     * @param {EventLogUpdateArgs} args - Arguments to update one EventLog.
     * @example
     * // Update one EventLog
     * const eventLog = await prisma.eventLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventLogUpdateArgs>(args: SelectSubset<T, EventLogUpdateArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventLogs.
     * @param {EventLogDeleteManyArgs} args - Arguments to filter EventLogs to delete.
     * @example
     * // Delete a few EventLogs
     * const { count } = await prisma.eventLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventLogDeleteManyArgs>(args?: SelectSubset<T, EventLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventLogs
     * const eventLog = await prisma.eventLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventLogUpdateManyArgs>(args: SelectSubset<T, EventLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventLogs and returns the data updated in the database.
     * @param {EventLogUpdateManyAndReturnArgs} args - Arguments to update many EventLogs.
     * @example
     * // Update many EventLogs
     * const eventLog = await prisma.eventLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventLogs and only return the `id`
     * const eventLogWithIdOnly = await prisma.eventLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends EventLogUpdateManyAndReturnArgs>(args: SelectSubset<T, EventLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventLog.
     * @param {EventLogUpsertArgs} args - Arguments to update or create a EventLog.
     * @example
     * // Update or create a EventLog
     * const eventLog = await prisma.eventLog.upsert({
     *   create: {
     *     // ... data to create a EventLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventLog we want to update
     *   }
     * })
     */
    upsert<T extends EventLogUpsertArgs>(args: SelectSubset<T, EventLogUpsertArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogCountArgs} args - Arguments to filter EventLogs to count.
     * @example
     * // Count the number of EventLogs
     * const count = await prisma.eventLog.count({
     *   where: {
     *     // ... the filter for the EventLogs we want to count
     *   }
     * })
    **/
    count<T extends EventLogCountArgs>(
      args?: Subset<T, EventLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventLogAggregateArgs>(args: Subset<T, EventLogAggregateArgs>): Prisma.PrismaPromise<GetEventLogAggregateType<T>>

    /**
     * Group by EventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogGroupByArgs} args - Group by arguments.
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
      T extends EventLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventLogGroupByArgs['orderBy'] }
        : { orderBy?: EventLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EventLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventLog model
   */
  readonly fields: EventLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the EventLog model
   */
  interface EventLogFieldRefs {
    readonly id: FieldRef<"EventLog", 'String'>
    readonly eventType: FieldRef<"EventLog", 'String'>
    readonly eventName: FieldRef<"EventLog", 'String'>
    readonly userId: FieldRef<"EventLog", 'String'>
    readonly sessionId: FieldRef<"EventLog", 'String'>
    readonly entityType: FieldRef<"EventLog", 'String'>
    readonly entityId: FieldRef<"EventLog", 'String'>
    readonly metadata: FieldRef<"EventLog", 'Json'>
    readonly ipAddress: FieldRef<"EventLog", 'String'>
    readonly userAgent: FieldRef<"EventLog", 'String'>
    readonly referer: FieldRef<"EventLog", 'String'>
    readonly createdAt: FieldRef<"EventLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventLog findUnique
   */
  export type EventLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog findUniqueOrThrow
   */
  export type EventLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog findFirst
   */
  export type EventLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: EventLogScalarFieldEnum | EventLogScalarFieldEnum[]
  }

  /**
   * EventLog findFirstOrThrow
   */
  export type EventLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: EventLogScalarFieldEnum | EventLogScalarFieldEnum[]
  }

  /**
   * EventLog findMany
   */
  export type EventLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * Filter, which EventLogs to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: EventLogScalarFieldEnum | EventLogScalarFieldEnum[]
  }

  /**
   * EventLog create
   */
  export type EventLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * The data needed to create a EventLog.
     */
    data: XOR<EventLogCreateInput, EventLogUncheckedCreateInput>
  }

  /**
   * EventLog createMany
   */
  export type EventLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventLogs.
     */
    data: EventLogCreateManyInput | EventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventLog createManyAndReturn
   */
  export type EventLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * The data used to create many EventLogs.
     */
    data: EventLogCreateManyInput | EventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventLog update
   */
  export type EventLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * The data needed to update a EventLog.
     */
    data: XOR<EventLogUpdateInput, EventLogUncheckedUpdateInput>
    /**
     * Choose, which EventLog to update.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog updateMany
   */
  export type EventLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventLogs.
     */
    data: XOR<EventLogUpdateManyMutationInput, EventLogUncheckedUpdateManyInput>
    /**
     * Filter which EventLogs to update
     */
    where?: EventLogWhereInput
    /**
     * Limit how many EventLogs to update.
     */
    limit?: number
  }

  /**
   * EventLog updateManyAndReturn
   */
  export type EventLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * The data used to update EventLogs.
     */
    data: XOR<EventLogUpdateManyMutationInput, EventLogUncheckedUpdateManyInput>
    /**
     * Filter which EventLogs to update
     */
    where?: EventLogWhereInput
    /**
     * Limit how many EventLogs to update.
     */
    limit?: number
  }

  /**
   * EventLog upsert
   */
  export type EventLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * The filter to search for the EventLog to update in case it exists.
     */
    where: EventLogWhereUniqueInput
    /**
     * In case the EventLog found by the `where` argument doesn't exist, create a new EventLog with this data.
     */
    create: XOR<EventLogCreateInput, EventLogUncheckedCreateInput>
    /**
     * In case the EventLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventLogUpdateInput, EventLogUncheckedUpdateInput>
  }

  /**
   * EventLog delete
   */
  export type EventLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
    /**
     * Filter which EventLog to delete.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog deleteMany
   */
  export type EventLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLogs to delete
     */
    where?: EventLogWhereInput
    /**
     * Limit how many EventLogs to delete.
     */
    limit?: number
  }

  /**
   * EventLog without action
   */
  export type EventLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLog
     */
    omit?: EventLogOmit<ExtArgs> | null
  }


  /**
   * Model SearchAnalytics
   */

  export type AggregateSearchAnalytics = {
    _count: SearchAnalyticsCountAggregateOutputType | null
    _avg: SearchAnalyticsAvgAggregateOutputType | null
    _sum: SearchAnalyticsSumAggregateOutputType | null
    _min: SearchAnalyticsMinAggregateOutputType | null
    _max: SearchAnalyticsMaxAggregateOutputType | null
  }

  export type SearchAnalyticsAvgAggregateOutputType = {
    resultsCount: number | null
  }

  export type SearchAnalyticsSumAggregateOutputType = {
    resultsCount: number | null
  }

  export type SearchAnalyticsMinAggregateOutputType = {
    id: string | null
    query: string | null
    resultsCount: number | null
    clickedProductId: string | null
    userId: string | null
    sessionId: string | null
    createdAt: Date | null
  }

  export type SearchAnalyticsMaxAggregateOutputType = {
    id: string | null
    query: string | null
    resultsCount: number | null
    clickedProductId: string | null
    userId: string | null
    sessionId: string | null
    createdAt: Date | null
  }

  export type SearchAnalyticsCountAggregateOutputType = {
    id: number
    query: number
    resultsCount: number
    clickedProductId: number
    userId: number
    sessionId: number
    createdAt: number
    _all: number
  }


  export type SearchAnalyticsAvgAggregateInputType = {
    resultsCount?: true
  }

  export type SearchAnalyticsSumAggregateInputType = {
    resultsCount?: true
  }

  export type SearchAnalyticsMinAggregateInputType = {
    id?: true
    query?: true
    resultsCount?: true
    clickedProductId?: true
    userId?: true
    sessionId?: true
    createdAt?: true
  }

  export type SearchAnalyticsMaxAggregateInputType = {
    id?: true
    query?: true
    resultsCount?: true
    clickedProductId?: true
    userId?: true
    sessionId?: true
    createdAt?: true
  }

  export type SearchAnalyticsCountAggregateInputType = {
    id?: true
    query?: true
    resultsCount?: true
    clickedProductId?: true
    userId?: true
    sessionId?: true
    createdAt?: true
    _all?: true
  }

  export type SearchAnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchAnalytics to aggregate.
     */
    where?: SearchAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchAnalytics to fetch.
     */
    orderBy?: SearchAnalyticsOrderByWithRelationInput | SearchAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SearchAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SearchAnalytics
    **/
    _count?: true | SearchAnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SearchAnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SearchAnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SearchAnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SearchAnalyticsMaxAggregateInputType
  }

  export type GetSearchAnalyticsAggregateType<T extends SearchAnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateSearchAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSearchAnalytics[P]>
      : GetScalarType<T[P], AggregateSearchAnalytics[P]>
  }




  export type SearchAnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SearchAnalyticsWhereInput
    orderBy?: SearchAnalyticsOrderByWithAggregationInput | SearchAnalyticsOrderByWithAggregationInput[]
    by: SearchAnalyticsScalarFieldEnum[] | SearchAnalyticsScalarFieldEnum
    having?: SearchAnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SearchAnalyticsCountAggregateInputType | true
    _avg?: SearchAnalyticsAvgAggregateInputType
    _sum?: SearchAnalyticsSumAggregateInputType
    _min?: SearchAnalyticsMinAggregateInputType
    _max?: SearchAnalyticsMaxAggregateInputType
  }

  export type SearchAnalyticsGroupByOutputType = {
    id: string
    query: string
    resultsCount: number
    clickedProductId: string | null
    userId: string | null
    sessionId: string | null
    createdAt: Date
    _count: SearchAnalyticsCountAggregateOutputType | null
    _avg: SearchAnalyticsAvgAggregateOutputType | null
    _sum: SearchAnalyticsSumAggregateOutputType | null
    _min: SearchAnalyticsMinAggregateOutputType | null
    _max: SearchAnalyticsMaxAggregateOutputType | null
  }

  type GetSearchAnalyticsGroupByPayload<T extends SearchAnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SearchAnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SearchAnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SearchAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], SearchAnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type SearchAnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    query?: boolean
    resultsCount?: boolean
    clickedProductId?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["searchAnalytics"]>

  export type SearchAnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    query?: boolean
    resultsCount?: boolean
    clickedProductId?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["searchAnalytics"]>

  export type SearchAnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    query?: boolean
    resultsCount?: boolean
    clickedProductId?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["searchAnalytics"]>

  export type SearchAnalyticsSelectScalar = {
    id?: boolean
    query?: boolean
    resultsCount?: boolean
    clickedProductId?: boolean
    userId?: boolean
    sessionId?: boolean
    createdAt?: boolean
  }

  export type SearchAnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "query" | "resultsCount" | "clickedProductId" | "userId" | "sessionId" | "createdAt", ExtArgs["result"]["searchAnalytics"]>

  export type $SearchAnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SearchAnalytics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      query: string
      resultsCount: number
      clickedProductId: string | null
      userId: string | null
      sessionId: string | null
      createdAt: Date
    }, ExtArgs["result"]["searchAnalytics"]>
    composites: {}
  }

  type SearchAnalyticsGetPayload<S extends boolean | null | undefined | SearchAnalyticsDefaultArgs> = $Result.GetResult<Prisma.$SearchAnalyticsPayload, S>

  type SearchAnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SearchAnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SearchAnalyticsCountAggregateInputType | true
    }

  export interface SearchAnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SearchAnalytics'], meta: { name: 'SearchAnalytics' } }
    /**
     * Find zero or one SearchAnalytics that matches the filter.
     * @param {SearchAnalyticsFindUniqueArgs} args - Arguments to find a SearchAnalytics
     * @example
     * // Get one SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SearchAnalyticsFindUniqueArgs>(args: SelectSubset<T, SearchAnalyticsFindUniqueArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SearchAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SearchAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a SearchAnalytics
     * @example
     * // Get one SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SearchAnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, SearchAnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsFindFirstArgs} args - Arguments to find a SearchAnalytics
     * @example
     * // Get one SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SearchAnalyticsFindFirstArgs>(args?: SelectSubset<T, SearchAnalyticsFindFirstArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsFindFirstOrThrowArgs} args - Arguments to find a SearchAnalytics
     * @example
     * // Get one SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SearchAnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, SearchAnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SearchAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.findMany()
     * 
     * // Get first 10 SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const searchAnalyticsWithIdOnly = await prisma.searchAnalytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SearchAnalyticsFindManyArgs>(args?: SelectSubset<T, SearchAnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SearchAnalytics.
     * @param {SearchAnalyticsCreateArgs} args - Arguments to create a SearchAnalytics.
     * @example
     * // Create one SearchAnalytics
     * const SearchAnalytics = await prisma.searchAnalytics.create({
     *   data: {
     *     // ... data to create a SearchAnalytics
     *   }
     * })
     * 
     */
    create<T extends SearchAnalyticsCreateArgs>(args: SelectSubset<T, SearchAnalyticsCreateArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SearchAnalytics.
     * @param {SearchAnalyticsCreateManyArgs} args - Arguments to create many SearchAnalytics.
     * @example
     * // Create many SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SearchAnalyticsCreateManyArgs>(args?: SelectSubset<T, SearchAnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SearchAnalytics and returns the data saved in the database.
     * @param {SearchAnalyticsCreateManyAndReturnArgs} args - Arguments to create many SearchAnalytics.
     * @example
     * // Create many SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SearchAnalytics and only return the `id`
     * const searchAnalyticsWithIdOnly = await prisma.searchAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SearchAnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, SearchAnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SearchAnalytics.
     * @param {SearchAnalyticsDeleteArgs} args - Arguments to delete one SearchAnalytics.
     * @example
     * // Delete one SearchAnalytics
     * const SearchAnalytics = await prisma.searchAnalytics.delete({
     *   where: {
     *     // ... filter to delete one SearchAnalytics
     *   }
     * })
     * 
     */
    delete<T extends SearchAnalyticsDeleteArgs>(args: SelectSubset<T, SearchAnalyticsDeleteArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SearchAnalytics.
     * @param {SearchAnalyticsUpdateArgs} args - Arguments to update one SearchAnalytics.
     * @example
     * // Update one SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SearchAnalyticsUpdateArgs>(args: SelectSubset<T, SearchAnalyticsUpdateArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SearchAnalytics.
     * @param {SearchAnalyticsDeleteManyArgs} args - Arguments to filter SearchAnalytics to delete.
     * @example
     * // Delete a few SearchAnalytics
     * const { count } = await prisma.searchAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SearchAnalyticsDeleteManyArgs>(args?: SelectSubset<T, SearchAnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SearchAnalyticsUpdateManyArgs>(args: SelectSubset<T, SearchAnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchAnalytics and returns the data updated in the database.
     * @param {SearchAnalyticsUpdateManyAndReturnArgs} args - Arguments to update many SearchAnalytics.
     * @example
     * // Update many SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SearchAnalytics and only return the `id`
     * const searchAnalyticsWithIdOnly = await prisma.searchAnalytics.updateManyAndReturn({
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
    updateManyAndReturn<T extends SearchAnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, SearchAnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SearchAnalytics.
     * @param {SearchAnalyticsUpsertArgs} args - Arguments to update or create a SearchAnalytics.
     * @example
     * // Update or create a SearchAnalytics
     * const searchAnalytics = await prisma.searchAnalytics.upsert({
     *   create: {
     *     // ... data to create a SearchAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SearchAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends SearchAnalyticsUpsertArgs>(args: SelectSubset<T, SearchAnalyticsUpsertArgs<ExtArgs>>): Prisma__SearchAnalyticsClient<$Result.GetResult<Prisma.$SearchAnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SearchAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsCountArgs} args - Arguments to filter SearchAnalytics to count.
     * @example
     * // Count the number of SearchAnalytics
     * const count = await prisma.searchAnalytics.count({
     *   where: {
     *     // ... the filter for the SearchAnalytics we want to count
     *   }
     * })
    **/
    count<T extends SearchAnalyticsCountArgs>(
      args?: Subset<T, SearchAnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SearchAnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SearchAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SearchAnalyticsAggregateArgs>(args: Subset<T, SearchAnalyticsAggregateArgs>): Prisma.PrismaPromise<GetSearchAnalyticsAggregateType<T>>

    /**
     * Group by SearchAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchAnalyticsGroupByArgs} args - Group by arguments.
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
      T extends SearchAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SearchAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: SearchAnalyticsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SearchAnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSearchAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SearchAnalytics model
   */
  readonly fields: SearchAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SearchAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SearchAnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SearchAnalytics model
   */
  interface SearchAnalyticsFieldRefs {
    readonly id: FieldRef<"SearchAnalytics", 'String'>
    readonly query: FieldRef<"SearchAnalytics", 'String'>
    readonly resultsCount: FieldRef<"SearchAnalytics", 'Int'>
    readonly clickedProductId: FieldRef<"SearchAnalytics", 'String'>
    readonly userId: FieldRef<"SearchAnalytics", 'String'>
    readonly sessionId: FieldRef<"SearchAnalytics", 'String'>
    readonly createdAt: FieldRef<"SearchAnalytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SearchAnalytics findUnique
   */
  export type SearchAnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which SearchAnalytics to fetch.
     */
    where: SearchAnalyticsWhereUniqueInput
  }

  /**
   * SearchAnalytics findUniqueOrThrow
   */
  export type SearchAnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which SearchAnalytics to fetch.
     */
    where: SearchAnalyticsWhereUniqueInput
  }

  /**
   * SearchAnalytics findFirst
   */
  export type SearchAnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which SearchAnalytics to fetch.
     */
    where?: SearchAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchAnalytics to fetch.
     */
    orderBy?: SearchAnalyticsOrderByWithRelationInput | SearchAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchAnalytics.
     */
    cursor?: SearchAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchAnalytics.
     */
    distinct?: SearchAnalyticsScalarFieldEnum | SearchAnalyticsScalarFieldEnum[]
  }

  /**
   * SearchAnalytics findFirstOrThrow
   */
  export type SearchAnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which SearchAnalytics to fetch.
     */
    where?: SearchAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchAnalytics to fetch.
     */
    orderBy?: SearchAnalyticsOrderByWithRelationInput | SearchAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchAnalytics.
     */
    cursor?: SearchAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchAnalytics.
     */
    distinct?: SearchAnalyticsScalarFieldEnum | SearchAnalyticsScalarFieldEnum[]
  }

  /**
   * SearchAnalytics findMany
   */
  export type SearchAnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which SearchAnalytics to fetch.
     */
    where?: SearchAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchAnalytics to fetch.
     */
    orderBy?: SearchAnalyticsOrderByWithRelationInput | SearchAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SearchAnalytics.
     */
    cursor?: SearchAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchAnalytics.
     */
    distinct?: SearchAnalyticsScalarFieldEnum | SearchAnalyticsScalarFieldEnum[]
  }

  /**
   * SearchAnalytics create
   */
  export type SearchAnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to create a SearchAnalytics.
     */
    data: XOR<SearchAnalyticsCreateInput, SearchAnalyticsUncheckedCreateInput>
  }

  /**
   * SearchAnalytics createMany
   */
  export type SearchAnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SearchAnalytics.
     */
    data: SearchAnalyticsCreateManyInput | SearchAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SearchAnalytics createManyAndReturn
   */
  export type SearchAnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many SearchAnalytics.
     */
    data: SearchAnalyticsCreateManyInput | SearchAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SearchAnalytics update
   */
  export type SearchAnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to update a SearchAnalytics.
     */
    data: XOR<SearchAnalyticsUpdateInput, SearchAnalyticsUncheckedUpdateInput>
    /**
     * Choose, which SearchAnalytics to update.
     */
    where: SearchAnalyticsWhereUniqueInput
  }

  /**
   * SearchAnalytics updateMany
   */
  export type SearchAnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SearchAnalytics.
     */
    data: XOR<SearchAnalyticsUpdateManyMutationInput, SearchAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which SearchAnalytics to update
     */
    where?: SearchAnalyticsWhereInput
    /**
     * Limit how many SearchAnalytics to update.
     */
    limit?: number
  }

  /**
   * SearchAnalytics updateManyAndReturn
   */
  export type SearchAnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update SearchAnalytics.
     */
    data: XOR<SearchAnalyticsUpdateManyMutationInput, SearchAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which SearchAnalytics to update
     */
    where?: SearchAnalyticsWhereInput
    /**
     * Limit how many SearchAnalytics to update.
     */
    limit?: number
  }

  /**
   * SearchAnalytics upsert
   */
  export type SearchAnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * The filter to search for the SearchAnalytics to update in case it exists.
     */
    where: SearchAnalyticsWhereUniqueInput
    /**
     * In case the SearchAnalytics found by the `where` argument doesn't exist, create a new SearchAnalytics with this data.
     */
    create: XOR<SearchAnalyticsCreateInput, SearchAnalyticsUncheckedCreateInput>
    /**
     * In case the SearchAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SearchAnalyticsUpdateInput, SearchAnalyticsUncheckedUpdateInput>
  }

  /**
   * SearchAnalytics delete
   */
  export type SearchAnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
    /**
     * Filter which SearchAnalytics to delete.
     */
    where: SearchAnalyticsWhereUniqueInput
  }

  /**
   * SearchAnalytics deleteMany
   */
  export type SearchAnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchAnalytics to delete
     */
    where?: SearchAnalyticsWhereInput
    /**
     * Limit how many SearchAnalytics to delete.
     */
    limit?: number
  }

  /**
   * SearchAnalytics without action
   */
  export type SearchAnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchAnalytics
     */
    select?: SearchAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchAnalytics
     */
    omit?: SearchAnalyticsOmit<ExtArgs> | null
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


  export const DailySalesReportScalarFieldEnum: {
    id: 'id',
    date: 'date',
    totalOrders: 'totalOrders',
    totalRevenue: 'totalRevenue',
    totalItems: 'totalItems',
    averageOrderValue: 'averageOrderValue',
    completedOrders: 'completedOrders',
    cancelledOrders: 'cancelledOrders',
    pendingOrders: 'pendingOrders',
    newCustomers: 'newCustomers',
    returningCustomers: 'returningCustomers',
    codOrders: 'codOrders',
    bkashOrders: 'bkashOrders',
    otherPayments: 'otherPayments',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DailySalesReportScalarFieldEnum = (typeof DailySalesReportScalarFieldEnum)[keyof typeof DailySalesReportScalarFieldEnum]


  export const VendorReportScalarFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    date: 'date',
    totalOrders: 'totalOrders',
    totalRevenue: 'totalRevenue',
    totalItems: 'totalItems',
    commission: 'commission',
    netRevenue: 'netRevenue',
    productViews: 'productViews',
    productClickRate: 'productClickRate',
    conversionRate: 'conversionRate',
    averageRating: 'averageRating',
    newReviews: 'newReviews',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VendorReportScalarFieldEnum = (typeof VendorReportScalarFieldEnum)[keyof typeof VendorReportScalarFieldEnum]


  export const ProductAnalyticsScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    date: 'date',
    views: 'views',
    uniqueViews: 'uniqueViews',
    addToCart: 'addToCart',
    purchases: 'purchases',
    revenue: 'revenue',
    conversionRate: 'conversionRate',
    bounceRate: 'bounceRate',
    searchImpressions: 'searchImpressions',
    searchClicks: 'searchClicks',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductAnalyticsScalarFieldEnum = (typeof ProductAnalyticsScalarFieldEnum)[keyof typeof ProductAnalyticsScalarFieldEnum]


  export const CategoryAnalyticsScalarFieldEnum: {
    id: 'id',
    categoryId: 'categoryId',
    date: 'date',
    views: 'views',
    productViews: 'productViews',
    purchases: 'purchases',
    revenue: 'revenue',
    topProductIds: 'topProductIds',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryAnalyticsScalarFieldEnum = (typeof CategoryAnalyticsScalarFieldEnum)[keyof typeof CategoryAnalyticsScalarFieldEnum]


  export const UserAnalyticsScalarFieldEnum: {
    id: 'id',
    date: 'date',
    newRegistrations: 'newRegistrations',
    activeUsers: 'activeUsers',
    totalSessions: 'totalSessions',
    avgSessionDuration: 'avgSessionDuration',
    bounceRate: 'bounceRate',
    mobileUsers: 'mobileUsers',
    desktopUsers: 'desktopUsers',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserAnalyticsScalarFieldEnum = (typeof UserAnalyticsScalarFieldEnum)[keyof typeof UserAnalyticsScalarFieldEnum]


  export const EventLogScalarFieldEnum: {
    id: 'id',
    eventType: 'eventType',
    eventName: 'eventName',
    userId: 'userId',
    sessionId: 'sessionId',
    entityType: 'entityType',
    entityId: 'entityId',
    metadata: 'metadata',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    referer: 'referer',
    createdAt: 'createdAt'
  };

  export type EventLogScalarFieldEnum = (typeof EventLogScalarFieldEnum)[keyof typeof EventLogScalarFieldEnum]


  export const SearchAnalyticsScalarFieldEnum: {
    id: 'id',
    query: 'query',
    resultsCount: 'resultsCount',
    clickedProductId: 'clickedProductId',
    userId: 'userId',
    sessionId: 'sessionId',
    createdAt: 'createdAt'
  };

  export type SearchAnalyticsScalarFieldEnum = (typeof SearchAnalyticsScalarFieldEnum)[keyof typeof SearchAnalyticsScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type DailySalesReportWhereInput = {
    AND?: DailySalesReportWhereInput | DailySalesReportWhereInput[]
    OR?: DailySalesReportWhereInput[]
    NOT?: DailySalesReportWhereInput | DailySalesReportWhereInput[]
    id?: StringFilter<"DailySalesReport"> | string
    date?: DateTimeFilter<"DailySalesReport"> | Date | string
    totalOrders?: IntFilter<"DailySalesReport"> | number
    totalRevenue?: DecimalFilter<"DailySalesReport"> | Decimal | DecimalJsLike | number | string
    totalItems?: IntFilter<"DailySalesReport"> | number
    averageOrderValue?: DecimalFilter<"DailySalesReport"> | Decimal | DecimalJsLike | number | string
    completedOrders?: IntFilter<"DailySalesReport"> | number
    cancelledOrders?: IntFilter<"DailySalesReport"> | number
    pendingOrders?: IntFilter<"DailySalesReport"> | number
    newCustomers?: IntFilter<"DailySalesReport"> | number
    returningCustomers?: IntFilter<"DailySalesReport"> | number
    codOrders?: IntFilter<"DailySalesReport"> | number
    bkashOrders?: IntFilter<"DailySalesReport"> | number
    otherPayments?: IntFilter<"DailySalesReport"> | number
    createdAt?: DateTimeFilter<"DailySalesReport"> | Date | string
    updatedAt?: DateTimeFilter<"DailySalesReport"> | Date | string
  }

  export type DailySalesReportOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySalesReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: DailySalesReportWhereInput | DailySalesReportWhereInput[]
    OR?: DailySalesReportWhereInput[]
    NOT?: DailySalesReportWhereInput | DailySalesReportWhereInput[]
    totalOrders?: IntFilter<"DailySalesReport"> | number
    totalRevenue?: DecimalFilter<"DailySalesReport"> | Decimal | DecimalJsLike | number | string
    totalItems?: IntFilter<"DailySalesReport"> | number
    averageOrderValue?: DecimalFilter<"DailySalesReport"> | Decimal | DecimalJsLike | number | string
    completedOrders?: IntFilter<"DailySalesReport"> | number
    cancelledOrders?: IntFilter<"DailySalesReport"> | number
    pendingOrders?: IntFilter<"DailySalesReport"> | number
    newCustomers?: IntFilter<"DailySalesReport"> | number
    returningCustomers?: IntFilter<"DailySalesReport"> | number
    codOrders?: IntFilter<"DailySalesReport"> | number
    bkashOrders?: IntFilter<"DailySalesReport"> | number
    otherPayments?: IntFilter<"DailySalesReport"> | number
    createdAt?: DateTimeFilter<"DailySalesReport"> | Date | string
    updatedAt?: DateTimeFilter<"DailySalesReport"> | Date | string
  }, "id" | "date">

  export type DailySalesReportOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DailySalesReportCountOrderByAggregateInput
    _avg?: DailySalesReportAvgOrderByAggregateInput
    _max?: DailySalesReportMaxOrderByAggregateInput
    _min?: DailySalesReportMinOrderByAggregateInput
    _sum?: DailySalesReportSumOrderByAggregateInput
  }

  export type DailySalesReportScalarWhereWithAggregatesInput = {
    AND?: DailySalesReportScalarWhereWithAggregatesInput | DailySalesReportScalarWhereWithAggregatesInput[]
    OR?: DailySalesReportScalarWhereWithAggregatesInput[]
    NOT?: DailySalesReportScalarWhereWithAggregatesInput | DailySalesReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DailySalesReport"> | string
    date?: DateTimeWithAggregatesFilter<"DailySalesReport"> | Date | string
    totalOrders?: IntWithAggregatesFilter<"DailySalesReport"> | number
    totalRevenue?: DecimalWithAggregatesFilter<"DailySalesReport"> | Decimal | DecimalJsLike | number | string
    totalItems?: IntWithAggregatesFilter<"DailySalesReport"> | number
    averageOrderValue?: DecimalWithAggregatesFilter<"DailySalesReport"> | Decimal | DecimalJsLike | number | string
    completedOrders?: IntWithAggregatesFilter<"DailySalesReport"> | number
    cancelledOrders?: IntWithAggregatesFilter<"DailySalesReport"> | number
    pendingOrders?: IntWithAggregatesFilter<"DailySalesReport"> | number
    newCustomers?: IntWithAggregatesFilter<"DailySalesReport"> | number
    returningCustomers?: IntWithAggregatesFilter<"DailySalesReport"> | number
    codOrders?: IntWithAggregatesFilter<"DailySalesReport"> | number
    bkashOrders?: IntWithAggregatesFilter<"DailySalesReport"> | number
    otherPayments?: IntWithAggregatesFilter<"DailySalesReport"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DailySalesReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DailySalesReport"> | Date | string
  }

  export type VendorReportWhereInput = {
    AND?: VendorReportWhereInput | VendorReportWhereInput[]
    OR?: VendorReportWhereInput[]
    NOT?: VendorReportWhereInput | VendorReportWhereInput[]
    id?: StringFilter<"VendorReport"> | string
    vendorId?: StringFilter<"VendorReport"> | string
    date?: DateTimeFilter<"VendorReport"> | Date | string
    totalOrders?: IntFilter<"VendorReport"> | number
    totalRevenue?: DecimalFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    totalItems?: IntFilter<"VendorReport"> | number
    commission?: DecimalFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    productViews?: IntFilter<"VendorReport"> | number
    productClickRate?: FloatFilter<"VendorReport"> | number
    conversionRate?: FloatFilter<"VendorReport"> | number
    averageRating?: FloatFilter<"VendorReport"> | number
    newReviews?: IntFilter<"VendorReport"> | number
    createdAt?: DateTimeFilter<"VendorReport"> | Date | string
    updatedAt?: DateTimeFilter<"VendorReport"> | Date | string
  }

  export type VendorReportOrderByWithRelationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    vendorId_date?: VendorReportVendorIdDateCompoundUniqueInput
    AND?: VendorReportWhereInput | VendorReportWhereInput[]
    OR?: VendorReportWhereInput[]
    NOT?: VendorReportWhereInput | VendorReportWhereInput[]
    vendorId?: StringFilter<"VendorReport"> | string
    date?: DateTimeFilter<"VendorReport"> | Date | string
    totalOrders?: IntFilter<"VendorReport"> | number
    totalRevenue?: DecimalFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    totalItems?: IntFilter<"VendorReport"> | number
    commission?: DecimalFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    productViews?: IntFilter<"VendorReport"> | number
    productClickRate?: FloatFilter<"VendorReport"> | number
    conversionRate?: FloatFilter<"VendorReport"> | number
    averageRating?: FloatFilter<"VendorReport"> | number
    newReviews?: IntFilter<"VendorReport"> | number
    createdAt?: DateTimeFilter<"VendorReport"> | Date | string
    updatedAt?: DateTimeFilter<"VendorReport"> | Date | string
  }, "id" | "vendorId_date">

  export type VendorReportOrderByWithAggregationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VendorReportCountOrderByAggregateInput
    _avg?: VendorReportAvgOrderByAggregateInput
    _max?: VendorReportMaxOrderByAggregateInput
    _min?: VendorReportMinOrderByAggregateInput
    _sum?: VendorReportSumOrderByAggregateInput
  }

  export type VendorReportScalarWhereWithAggregatesInput = {
    AND?: VendorReportScalarWhereWithAggregatesInput | VendorReportScalarWhereWithAggregatesInput[]
    OR?: VendorReportScalarWhereWithAggregatesInput[]
    NOT?: VendorReportScalarWhereWithAggregatesInput | VendorReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VendorReport"> | string
    vendorId?: StringWithAggregatesFilter<"VendorReport"> | string
    date?: DateTimeWithAggregatesFilter<"VendorReport"> | Date | string
    totalOrders?: IntWithAggregatesFilter<"VendorReport"> | number
    totalRevenue?: DecimalWithAggregatesFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    totalItems?: IntWithAggregatesFilter<"VendorReport"> | number
    commission?: DecimalWithAggregatesFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalWithAggregatesFilter<"VendorReport"> | Decimal | DecimalJsLike | number | string
    productViews?: IntWithAggregatesFilter<"VendorReport"> | number
    productClickRate?: FloatWithAggregatesFilter<"VendorReport"> | number
    conversionRate?: FloatWithAggregatesFilter<"VendorReport"> | number
    averageRating?: FloatWithAggregatesFilter<"VendorReport"> | number
    newReviews?: IntWithAggregatesFilter<"VendorReport"> | number
    createdAt?: DateTimeWithAggregatesFilter<"VendorReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VendorReport"> | Date | string
  }

  export type ProductAnalyticsWhereInput = {
    AND?: ProductAnalyticsWhereInput | ProductAnalyticsWhereInput[]
    OR?: ProductAnalyticsWhereInput[]
    NOT?: ProductAnalyticsWhereInput | ProductAnalyticsWhereInput[]
    id?: StringFilter<"ProductAnalytics"> | string
    productId?: StringFilter<"ProductAnalytics"> | string
    date?: DateTimeFilter<"ProductAnalytics"> | Date | string
    views?: IntFilter<"ProductAnalytics"> | number
    uniqueViews?: IntFilter<"ProductAnalytics"> | number
    addToCart?: IntFilter<"ProductAnalytics"> | number
    purchases?: IntFilter<"ProductAnalytics"> | number
    revenue?: DecimalFilter<"ProductAnalytics"> | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatFilter<"ProductAnalytics"> | number
    bounceRate?: FloatFilter<"ProductAnalytics"> | number
    searchImpressions?: IntFilter<"ProductAnalytics"> | number
    searchClicks?: IntFilter<"ProductAnalytics"> | number
    createdAt?: DateTimeFilter<"ProductAnalytics"> | Date | string
    updatedAt?: DateTimeFilter<"ProductAnalytics"> | Date | string
  }

  export type ProductAnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId_date?: ProductAnalyticsProductIdDateCompoundUniqueInput
    AND?: ProductAnalyticsWhereInput | ProductAnalyticsWhereInput[]
    OR?: ProductAnalyticsWhereInput[]
    NOT?: ProductAnalyticsWhereInput | ProductAnalyticsWhereInput[]
    productId?: StringFilter<"ProductAnalytics"> | string
    date?: DateTimeFilter<"ProductAnalytics"> | Date | string
    views?: IntFilter<"ProductAnalytics"> | number
    uniqueViews?: IntFilter<"ProductAnalytics"> | number
    addToCart?: IntFilter<"ProductAnalytics"> | number
    purchases?: IntFilter<"ProductAnalytics"> | number
    revenue?: DecimalFilter<"ProductAnalytics"> | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatFilter<"ProductAnalytics"> | number
    bounceRate?: FloatFilter<"ProductAnalytics"> | number
    searchImpressions?: IntFilter<"ProductAnalytics"> | number
    searchClicks?: IntFilter<"ProductAnalytics"> | number
    createdAt?: DateTimeFilter<"ProductAnalytics"> | Date | string
    updatedAt?: DateTimeFilter<"ProductAnalytics"> | Date | string
  }, "id" | "productId_date">

  export type ProductAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductAnalyticsCountOrderByAggregateInput
    _avg?: ProductAnalyticsAvgOrderByAggregateInput
    _max?: ProductAnalyticsMaxOrderByAggregateInput
    _min?: ProductAnalyticsMinOrderByAggregateInput
    _sum?: ProductAnalyticsSumOrderByAggregateInput
  }

  export type ProductAnalyticsScalarWhereWithAggregatesInput = {
    AND?: ProductAnalyticsScalarWhereWithAggregatesInput | ProductAnalyticsScalarWhereWithAggregatesInput[]
    OR?: ProductAnalyticsScalarWhereWithAggregatesInput[]
    NOT?: ProductAnalyticsScalarWhereWithAggregatesInput | ProductAnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductAnalytics"> | string
    productId?: StringWithAggregatesFilter<"ProductAnalytics"> | string
    date?: DateTimeWithAggregatesFilter<"ProductAnalytics"> | Date | string
    views?: IntWithAggregatesFilter<"ProductAnalytics"> | number
    uniqueViews?: IntWithAggregatesFilter<"ProductAnalytics"> | number
    addToCart?: IntWithAggregatesFilter<"ProductAnalytics"> | number
    purchases?: IntWithAggregatesFilter<"ProductAnalytics"> | number
    revenue?: DecimalWithAggregatesFilter<"ProductAnalytics"> | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatWithAggregatesFilter<"ProductAnalytics"> | number
    bounceRate?: FloatWithAggregatesFilter<"ProductAnalytics"> | number
    searchImpressions?: IntWithAggregatesFilter<"ProductAnalytics"> | number
    searchClicks?: IntWithAggregatesFilter<"ProductAnalytics"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ProductAnalytics"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductAnalytics"> | Date | string
  }

  export type CategoryAnalyticsWhereInput = {
    AND?: CategoryAnalyticsWhereInput | CategoryAnalyticsWhereInput[]
    OR?: CategoryAnalyticsWhereInput[]
    NOT?: CategoryAnalyticsWhereInput | CategoryAnalyticsWhereInput[]
    id?: StringFilter<"CategoryAnalytics"> | string
    categoryId?: StringFilter<"CategoryAnalytics"> | string
    date?: DateTimeFilter<"CategoryAnalytics"> | Date | string
    views?: IntFilter<"CategoryAnalytics"> | number
    productViews?: IntFilter<"CategoryAnalytics"> | number
    purchases?: IntFilter<"CategoryAnalytics"> | number
    revenue?: DecimalFilter<"CategoryAnalytics"> | Decimal | DecimalJsLike | number | string
    topProductIds?: StringNullableListFilter<"CategoryAnalytics">
    createdAt?: DateTimeFilter<"CategoryAnalytics"> | Date | string
    updatedAt?: DateTimeFilter<"CategoryAnalytics"> | Date | string
  }

  export type CategoryAnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    topProductIds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    categoryId_date?: CategoryAnalyticsCategoryIdDateCompoundUniqueInput
    AND?: CategoryAnalyticsWhereInput | CategoryAnalyticsWhereInput[]
    OR?: CategoryAnalyticsWhereInput[]
    NOT?: CategoryAnalyticsWhereInput | CategoryAnalyticsWhereInput[]
    categoryId?: StringFilter<"CategoryAnalytics"> | string
    date?: DateTimeFilter<"CategoryAnalytics"> | Date | string
    views?: IntFilter<"CategoryAnalytics"> | number
    productViews?: IntFilter<"CategoryAnalytics"> | number
    purchases?: IntFilter<"CategoryAnalytics"> | number
    revenue?: DecimalFilter<"CategoryAnalytics"> | Decimal | DecimalJsLike | number | string
    topProductIds?: StringNullableListFilter<"CategoryAnalytics">
    createdAt?: DateTimeFilter<"CategoryAnalytics"> | Date | string
    updatedAt?: DateTimeFilter<"CategoryAnalytics"> | Date | string
  }, "id" | "categoryId_date">

  export type CategoryAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    topProductIds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryAnalyticsCountOrderByAggregateInput
    _avg?: CategoryAnalyticsAvgOrderByAggregateInput
    _max?: CategoryAnalyticsMaxOrderByAggregateInput
    _min?: CategoryAnalyticsMinOrderByAggregateInput
    _sum?: CategoryAnalyticsSumOrderByAggregateInput
  }

  export type CategoryAnalyticsScalarWhereWithAggregatesInput = {
    AND?: CategoryAnalyticsScalarWhereWithAggregatesInput | CategoryAnalyticsScalarWhereWithAggregatesInput[]
    OR?: CategoryAnalyticsScalarWhereWithAggregatesInput[]
    NOT?: CategoryAnalyticsScalarWhereWithAggregatesInput | CategoryAnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CategoryAnalytics"> | string
    categoryId?: StringWithAggregatesFilter<"CategoryAnalytics"> | string
    date?: DateTimeWithAggregatesFilter<"CategoryAnalytics"> | Date | string
    views?: IntWithAggregatesFilter<"CategoryAnalytics"> | number
    productViews?: IntWithAggregatesFilter<"CategoryAnalytics"> | number
    purchases?: IntWithAggregatesFilter<"CategoryAnalytics"> | number
    revenue?: DecimalWithAggregatesFilter<"CategoryAnalytics"> | Decimal | DecimalJsLike | number | string
    topProductIds?: StringNullableListFilter<"CategoryAnalytics">
    createdAt?: DateTimeWithAggregatesFilter<"CategoryAnalytics"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CategoryAnalytics"> | Date | string
  }

  export type UserAnalyticsWhereInput = {
    AND?: UserAnalyticsWhereInput | UserAnalyticsWhereInput[]
    OR?: UserAnalyticsWhereInput[]
    NOT?: UserAnalyticsWhereInput | UserAnalyticsWhereInput[]
    id?: StringFilter<"UserAnalytics"> | string
    date?: DateTimeFilter<"UserAnalytics"> | Date | string
    newRegistrations?: IntFilter<"UserAnalytics"> | number
    activeUsers?: IntFilter<"UserAnalytics"> | number
    totalSessions?: IntFilter<"UserAnalytics"> | number
    avgSessionDuration?: IntFilter<"UserAnalytics"> | number
    bounceRate?: FloatFilter<"UserAnalytics"> | number
    mobileUsers?: IntFilter<"UserAnalytics"> | number
    desktopUsers?: IntFilter<"UserAnalytics"> | number
    createdAt?: DateTimeFilter<"UserAnalytics"> | Date | string
    updatedAt?: DateTimeFilter<"UserAnalytics"> | Date | string
  }

  export type UserAnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: UserAnalyticsWhereInput | UserAnalyticsWhereInput[]
    OR?: UserAnalyticsWhereInput[]
    NOT?: UserAnalyticsWhereInput | UserAnalyticsWhereInput[]
    newRegistrations?: IntFilter<"UserAnalytics"> | number
    activeUsers?: IntFilter<"UserAnalytics"> | number
    totalSessions?: IntFilter<"UserAnalytics"> | number
    avgSessionDuration?: IntFilter<"UserAnalytics"> | number
    bounceRate?: FloatFilter<"UserAnalytics"> | number
    mobileUsers?: IntFilter<"UserAnalytics"> | number
    desktopUsers?: IntFilter<"UserAnalytics"> | number
    createdAt?: DateTimeFilter<"UserAnalytics"> | Date | string
    updatedAt?: DateTimeFilter<"UserAnalytics"> | Date | string
  }, "id" | "date">

  export type UserAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserAnalyticsCountOrderByAggregateInput
    _avg?: UserAnalyticsAvgOrderByAggregateInput
    _max?: UserAnalyticsMaxOrderByAggregateInput
    _min?: UserAnalyticsMinOrderByAggregateInput
    _sum?: UserAnalyticsSumOrderByAggregateInput
  }

  export type UserAnalyticsScalarWhereWithAggregatesInput = {
    AND?: UserAnalyticsScalarWhereWithAggregatesInput | UserAnalyticsScalarWhereWithAggregatesInput[]
    OR?: UserAnalyticsScalarWhereWithAggregatesInput[]
    NOT?: UserAnalyticsScalarWhereWithAggregatesInput | UserAnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserAnalytics"> | string
    date?: DateTimeWithAggregatesFilter<"UserAnalytics"> | Date | string
    newRegistrations?: IntWithAggregatesFilter<"UserAnalytics"> | number
    activeUsers?: IntWithAggregatesFilter<"UserAnalytics"> | number
    totalSessions?: IntWithAggregatesFilter<"UserAnalytics"> | number
    avgSessionDuration?: IntWithAggregatesFilter<"UserAnalytics"> | number
    bounceRate?: FloatWithAggregatesFilter<"UserAnalytics"> | number
    mobileUsers?: IntWithAggregatesFilter<"UserAnalytics"> | number
    desktopUsers?: IntWithAggregatesFilter<"UserAnalytics"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UserAnalytics"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserAnalytics"> | Date | string
  }

  export type EventLogWhereInput = {
    AND?: EventLogWhereInput | EventLogWhereInput[]
    OR?: EventLogWhereInput[]
    NOT?: EventLogWhereInput | EventLogWhereInput[]
    id?: StringFilter<"EventLog"> | string
    eventType?: StringFilter<"EventLog"> | string
    eventName?: StringFilter<"EventLog"> | string
    userId?: StringNullableFilter<"EventLog"> | string | null
    sessionId?: StringNullableFilter<"EventLog"> | string | null
    entityType?: StringNullableFilter<"EventLog"> | string | null
    entityId?: StringNullableFilter<"EventLog"> | string | null
    metadata?: JsonNullableFilter<"EventLog">
    ipAddress?: StringNullableFilter<"EventLog"> | string | null
    userAgent?: StringNullableFilter<"EventLog"> | string | null
    referer?: StringNullableFilter<"EventLog"> | string | null
    createdAt?: DateTimeFilter<"EventLog"> | Date | string
  }

  export type EventLogOrderByWithRelationInput = {
    id?: SortOrder
    eventType?: SortOrder
    eventName?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    entityType?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    referer?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type EventLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventLogWhereInput | EventLogWhereInput[]
    OR?: EventLogWhereInput[]
    NOT?: EventLogWhereInput | EventLogWhereInput[]
    eventType?: StringFilter<"EventLog"> | string
    eventName?: StringFilter<"EventLog"> | string
    userId?: StringNullableFilter<"EventLog"> | string | null
    sessionId?: StringNullableFilter<"EventLog"> | string | null
    entityType?: StringNullableFilter<"EventLog"> | string | null
    entityId?: StringNullableFilter<"EventLog"> | string | null
    metadata?: JsonNullableFilter<"EventLog">
    ipAddress?: StringNullableFilter<"EventLog"> | string | null
    userAgent?: StringNullableFilter<"EventLog"> | string | null
    referer?: StringNullableFilter<"EventLog"> | string | null
    createdAt?: DateTimeFilter<"EventLog"> | Date | string
  }, "id">

  export type EventLogOrderByWithAggregationInput = {
    id?: SortOrder
    eventType?: SortOrder
    eventName?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    entityType?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    referer?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EventLogCountOrderByAggregateInput
    _max?: EventLogMaxOrderByAggregateInput
    _min?: EventLogMinOrderByAggregateInput
  }

  export type EventLogScalarWhereWithAggregatesInput = {
    AND?: EventLogScalarWhereWithAggregatesInput | EventLogScalarWhereWithAggregatesInput[]
    OR?: EventLogScalarWhereWithAggregatesInput[]
    NOT?: EventLogScalarWhereWithAggregatesInput | EventLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventLog"> | string
    eventType?: StringWithAggregatesFilter<"EventLog"> | string
    eventName?: StringWithAggregatesFilter<"EventLog"> | string
    userId?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    sessionId?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    entityType?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    entityId?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"EventLog">
    ipAddress?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    referer?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EventLog"> | Date | string
  }

  export type SearchAnalyticsWhereInput = {
    AND?: SearchAnalyticsWhereInput | SearchAnalyticsWhereInput[]
    OR?: SearchAnalyticsWhereInput[]
    NOT?: SearchAnalyticsWhereInput | SearchAnalyticsWhereInput[]
    id?: StringFilter<"SearchAnalytics"> | string
    query?: StringFilter<"SearchAnalytics"> | string
    resultsCount?: IntFilter<"SearchAnalytics"> | number
    clickedProductId?: StringNullableFilter<"SearchAnalytics"> | string | null
    userId?: StringNullableFilter<"SearchAnalytics"> | string | null
    sessionId?: StringNullableFilter<"SearchAnalytics"> | string | null
    createdAt?: DateTimeFilter<"SearchAnalytics"> | Date | string
  }

  export type SearchAnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    query?: SortOrder
    resultsCount?: SortOrder
    clickedProductId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type SearchAnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SearchAnalyticsWhereInput | SearchAnalyticsWhereInput[]
    OR?: SearchAnalyticsWhereInput[]
    NOT?: SearchAnalyticsWhereInput | SearchAnalyticsWhereInput[]
    query?: StringFilter<"SearchAnalytics"> | string
    resultsCount?: IntFilter<"SearchAnalytics"> | number
    clickedProductId?: StringNullableFilter<"SearchAnalytics"> | string | null
    userId?: StringNullableFilter<"SearchAnalytics"> | string | null
    sessionId?: StringNullableFilter<"SearchAnalytics"> | string | null
    createdAt?: DateTimeFilter<"SearchAnalytics"> | Date | string
  }, "id">

  export type SearchAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    query?: SortOrder
    resultsCount?: SortOrder
    clickedProductId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SearchAnalyticsCountOrderByAggregateInput
    _avg?: SearchAnalyticsAvgOrderByAggregateInput
    _max?: SearchAnalyticsMaxOrderByAggregateInput
    _min?: SearchAnalyticsMinOrderByAggregateInput
    _sum?: SearchAnalyticsSumOrderByAggregateInput
  }

  export type SearchAnalyticsScalarWhereWithAggregatesInput = {
    AND?: SearchAnalyticsScalarWhereWithAggregatesInput | SearchAnalyticsScalarWhereWithAggregatesInput[]
    OR?: SearchAnalyticsScalarWhereWithAggregatesInput[]
    NOT?: SearchAnalyticsScalarWhereWithAggregatesInput | SearchAnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SearchAnalytics"> | string
    query?: StringWithAggregatesFilter<"SearchAnalytics"> | string
    resultsCount?: IntWithAggregatesFilter<"SearchAnalytics"> | number
    clickedProductId?: StringNullableWithAggregatesFilter<"SearchAnalytics"> | string | null
    userId?: StringNullableWithAggregatesFilter<"SearchAnalytics"> | string | null
    sessionId?: StringNullableWithAggregatesFilter<"SearchAnalytics"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SearchAnalytics"> | Date | string
  }

  export type DailySalesReportCreateInput = {
    id?: string
    date: Date | string
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    totalItems?: number
    averageOrderValue?: Decimal | DecimalJsLike | number | string
    completedOrders?: number
    cancelledOrders?: number
    pendingOrders?: number
    newCustomers?: number
    returningCustomers?: number
    codOrders?: number
    bkashOrders?: number
    otherPayments?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailySalesReportUncheckedCreateInput = {
    id?: string
    date: Date | string
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    totalItems?: number
    averageOrderValue?: Decimal | DecimalJsLike | number | string
    completedOrders?: number
    cancelledOrders?: number
    pendingOrders?: number
    newCustomers?: number
    returningCustomers?: number
    codOrders?: number
    bkashOrders?: number
    otherPayments?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailySalesReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    averageOrderValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completedOrders?: IntFieldUpdateOperationsInput | number
    cancelledOrders?: IntFieldUpdateOperationsInput | number
    pendingOrders?: IntFieldUpdateOperationsInput | number
    newCustomers?: IntFieldUpdateOperationsInput | number
    returningCustomers?: IntFieldUpdateOperationsInput | number
    codOrders?: IntFieldUpdateOperationsInput | number
    bkashOrders?: IntFieldUpdateOperationsInput | number
    otherPayments?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailySalesReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    averageOrderValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completedOrders?: IntFieldUpdateOperationsInput | number
    cancelledOrders?: IntFieldUpdateOperationsInput | number
    pendingOrders?: IntFieldUpdateOperationsInput | number
    newCustomers?: IntFieldUpdateOperationsInput | number
    returningCustomers?: IntFieldUpdateOperationsInput | number
    codOrders?: IntFieldUpdateOperationsInput | number
    bkashOrders?: IntFieldUpdateOperationsInput | number
    otherPayments?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailySalesReportCreateManyInput = {
    id?: string
    date: Date | string
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    totalItems?: number
    averageOrderValue?: Decimal | DecimalJsLike | number | string
    completedOrders?: number
    cancelledOrders?: number
    pendingOrders?: number
    newCustomers?: number
    returningCustomers?: number
    codOrders?: number
    bkashOrders?: number
    otherPayments?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailySalesReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    averageOrderValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completedOrders?: IntFieldUpdateOperationsInput | number
    cancelledOrders?: IntFieldUpdateOperationsInput | number
    pendingOrders?: IntFieldUpdateOperationsInput | number
    newCustomers?: IntFieldUpdateOperationsInput | number
    returningCustomers?: IntFieldUpdateOperationsInput | number
    codOrders?: IntFieldUpdateOperationsInput | number
    bkashOrders?: IntFieldUpdateOperationsInput | number
    otherPayments?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailySalesReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    averageOrderValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completedOrders?: IntFieldUpdateOperationsInput | number
    cancelledOrders?: IntFieldUpdateOperationsInput | number
    pendingOrders?: IntFieldUpdateOperationsInput | number
    newCustomers?: IntFieldUpdateOperationsInput | number
    returningCustomers?: IntFieldUpdateOperationsInput | number
    codOrders?: IntFieldUpdateOperationsInput | number
    bkashOrders?: IntFieldUpdateOperationsInput | number
    otherPayments?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReportCreateInput = {
    id?: string
    vendorId: string
    date: Date | string
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    totalItems?: number
    commission?: Decimal | DecimalJsLike | number | string
    netRevenue?: Decimal | DecimalJsLike | number | string
    productViews?: number
    productClickRate?: number
    conversionRate?: number
    averageRating?: number
    newReviews?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReportUncheckedCreateInput = {
    id?: string
    vendorId: string
    date: Date | string
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    totalItems?: number
    commission?: Decimal | DecimalJsLike | number | string
    netRevenue?: Decimal | DecimalJsLike | number | string
    productViews?: number
    productClickRate?: number
    conversionRate?: number
    averageRating?: number
    newReviews?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    commission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    productViews?: IntFieldUpdateOperationsInput | number
    productClickRate?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    averageRating?: FloatFieldUpdateOperationsInput | number
    newReviews?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    commission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    productViews?: IntFieldUpdateOperationsInput | number
    productClickRate?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    averageRating?: FloatFieldUpdateOperationsInput | number
    newReviews?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReportCreateManyInput = {
    id?: string
    vendorId: string
    date: Date | string
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    totalItems?: number
    commission?: Decimal | DecimalJsLike | number | string
    netRevenue?: Decimal | DecimalJsLike | number | string
    productViews?: number
    productClickRate?: number
    conversionRate?: number
    averageRating?: number
    newReviews?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    commission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    productViews?: IntFieldUpdateOperationsInput | number
    productClickRate?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    averageRating?: FloatFieldUpdateOperationsInput | number
    newReviews?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalItems?: IntFieldUpdateOperationsInput | number
    commission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    productViews?: IntFieldUpdateOperationsInput | number
    productClickRate?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    averageRating?: FloatFieldUpdateOperationsInput | number
    newReviews?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAnalyticsCreateInput = {
    id?: string
    productId: string
    date: Date | string
    views?: number
    uniqueViews?: number
    addToCart?: number
    purchases?: number
    revenue?: Decimal | DecimalJsLike | number | string
    conversionRate?: number
    bounceRate?: number
    searchImpressions?: number
    searchClicks?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductAnalyticsUncheckedCreateInput = {
    id?: string
    productId: string
    date: Date | string
    views?: number
    uniqueViews?: number
    addToCart?: number
    purchases?: number
    revenue?: Decimal | DecimalJsLike | number | string
    conversionRate?: number
    bounceRate?: number
    searchImpressions?: number
    searchClicks?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    uniqueViews?: IntFieldUpdateOperationsInput | number
    addToCart?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    searchImpressions?: IntFieldUpdateOperationsInput | number
    searchClicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    uniqueViews?: IntFieldUpdateOperationsInput | number
    addToCart?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    searchImpressions?: IntFieldUpdateOperationsInput | number
    searchClicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAnalyticsCreateManyInput = {
    id?: string
    productId: string
    date: Date | string
    views?: number
    uniqueViews?: number
    addToCart?: number
    purchases?: number
    revenue?: Decimal | DecimalJsLike | number | string
    conversionRate?: number
    bounceRate?: number
    searchImpressions?: number
    searchClicks?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    uniqueViews?: IntFieldUpdateOperationsInput | number
    addToCart?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    searchImpressions?: IntFieldUpdateOperationsInput | number
    searchClicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    uniqueViews?: IntFieldUpdateOperationsInput | number
    addToCart?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversionRate?: FloatFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    searchImpressions?: IntFieldUpdateOperationsInput | number
    searchClicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryAnalyticsCreateInput = {
    id?: string
    categoryId: string
    date: Date | string
    views?: number
    productViews?: number
    purchases?: number
    revenue?: Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsCreatetopProductIdsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryAnalyticsUncheckedCreateInput = {
    id?: string
    categoryId: string
    date: Date | string
    views?: number
    productViews?: number
    purchases?: number
    revenue?: Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsCreatetopProductIdsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    productViews?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsUpdatetopProductIdsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    productViews?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsUpdatetopProductIdsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryAnalyticsCreateManyInput = {
    id?: string
    categoryId: string
    date: Date | string
    views?: number
    productViews?: number
    purchases?: number
    revenue?: Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsCreatetopProductIdsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    productViews?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsUpdatetopProductIdsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: IntFieldUpdateOperationsInput | number
    productViews?: IntFieldUpdateOperationsInput | number
    purchases?: IntFieldUpdateOperationsInput | number
    revenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    topProductIds?: CategoryAnalyticsUpdatetopProductIdsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAnalyticsCreateInput = {
    id?: string
    date: Date | string
    newRegistrations?: number
    activeUsers?: number
    totalSessions?: number
    avgSessionDuration?: number
    bounceRate?: number
    mobileUsers?: number
    desktopUsers?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAnalyticsUncheckedCreateInput = {
    id?: string
    date: Date | string
    newRegistrations?: number
    activeUsers?: number
    totalSessions?: number
    avgSessionDuration?: number
    bounceRate?: number
    mobileUsers?: number
    desktopUsers?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    newRegistrations?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    avgSessionDuration?: IntFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    mobileUsers?: IntFieldUpdateOperationsInput | number
    desktopUsers?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    newRegistrations?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    avgSessionDuration?: IntFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    mobileUsers?: IntFieldUpdateOperationsInput | number
    desktopUsers?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAnalyticsCreateManyInput = {
    id?: string
    date: Date | string
    newRegistrations?: number
    activeUsers?: number
    totalSessions?: number
    avgSessionDuration?: number
    bounceRate?: number
    mobileUsers?: number
    desktopUsers?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    newRegistrations?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    avgSessionDuration?: IntFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    mobileUsers?: IntFieldUpdateOperationsInput | number
    desktopUsers?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    newRegistrations?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    avgSessionDuration?: IntFieldUpdateOperationsInput | number
    bounceRate?: FloatFieldUpdateOperationsInput | number
    mobileUsers?: IntFieldUpdateOperationsInput | number
    desktopUsers?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLogCreateInput = {
    id?: string
    eventType: string
    eventName: string
    userId?: string | null
    sessionId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    referer?: string | null
    createdAt?: Date | string
  }

  export type EventLogUncheckedCreateInput = {
    id?: string
    eventType: string
    eventName: string
    userId?: string | null
    sessionId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    referer?: string | null
    createdAt?: Date | string
  }

  export type EventLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLogCreateManyInput = {
    id?: string
    eventType: string
    eventName: string
    userId?: string | null
    sessionId?: string | null
    entityType?: string | null
    entityId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    referer?: string | null
    createdAt?: Date | string
  }

  export type EventLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    referer?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchAnalyticsCreateInput = {
    id?: string
    query: string
    resultsCount?: number
    clickedProductId?: string | null
    userId?: string | null
    sessionId?: string | null
    createdAt?: Date | string
  }

  export type SearchAnalyticsUncheckedCreateInput = {
    id?: string
    query: string
    resultsCount?: number
    clickedProductId?: string | null
    userId?: string | null
    sessionId?: string | null
    createdAt?: Date | string
  }

  export type SearchAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultsCount?: IntFieldUpdateOperationsInput | number
    clickedProductId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultsCount?: IntFieldUpdateOperationsInput | number
    clickedProductId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchAnalyticsCreateManyInput = {
    id?: string
    query: string
    resultsCount?: number
    clickedProductId?: string | null
    userId?: string | null
    sessionId?: string | null
    createdAt?: Date | string
  }

  export type SearchAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultsCount?: IntFieldUpdateOperationsInput | number
    clickedProductId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    resultsCount?: IntFieldUpdateOperationsInput | number
    clickedProductId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type DailySalesReportCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySalesReportAvgOrderByAggregateInput = {
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
  }

  export type DailySalesReportMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySalesReportMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySalesReportSumOrderByAggregateInput = {
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    averageOrderValue?: SortOrder
    completedOrders?: SortOrder
    cancelledOrders?: SortOrder
    pendingOrders?: SortOrder
    newCustomers?: SortOrder
    returningCustomers?: SortOrder
    codOrders?: SortOrder
    bkashOrders?: SortOrder
    otherPayments?: SortOrder
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

  export type VendorReportVendorIdDateCompoundUniqueInput = {
    vendorId: string
    date: Date | string
  }

  export type VendorReportCountOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReportAvgOrderByAggregateInput = {
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
  }

  export type VendorReportMaxOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReportMinOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    date?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorReportSumOrderByAggregateInput = {
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    totalItems?: SortOrder
    commission?: SortOrder
    netRevenue?: SortOrder
    productViews?: SortOrder
    productClickRate?: SortOrder
    conversionRate?: SortOrder
    averageRating?: SortOrder
    newReviews?: SortOrder
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

  export type ProductAnalyticsProductIdDateCompoundUniqueInput = {
    productId: string
    date: Date | string
  }

  export type ProductAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAnalyticsAvgOrderByAggregateInput = {
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
  }

  export type ProductAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAnalyticsSumOrderByAggregateInput = {
    views?: SortOrder
    uniqueViews?: SortOrder
    addToCart?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    conversionRate?: SortOrder
    bounceRate?: SortOrder
    searchImpressions?: SortOrder
    searchClicks?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CategoryAnalyticsCategoryIdDateCompoundUniqueInput = {
    categoryId: string
    date: Date | string
  }

  export type CategoryAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    topProductIds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAnalyticsAvgOrderByAggregateInput = {
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
  }

  export type CategoryAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    date?: SortOrder
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAnalyticsSumOrderByAggregateInput = {
    views?: SortOrder
    productViews?: SortOrder
    purchases?: SortOrder
    revenue?: SortOrder
  }

  export type UserAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAnalyticsAvgOrderByAggregateInput = {
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
  }

  export type UserAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAnalyticsSumOrderByAggregateInput = {
    newRegistrations?: SortOrder
    activeUsers?: SortOrder
    totalSessions?: SortOrder
    avgSessionDuration?: SortOrder
    bounceRate?: SortOrder
    mobileUsers?: SortOrder
    desktopUsers?: SortOrder
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventLogCountOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    eventName?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    referer?: SortOrder
    createdAt?: SortOrder
  }

  export type EventLogMaxOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    eventName?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    referer?: SortOrder
    createdAt?: SortOrder
  }

  export type EventLogMinOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    eventName?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    referer?: SortOrder
    createdAt?: SortOrder
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

  export type SearchAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    query?: SortOrder
    resultsCount?: SortOrder
    clickedProductId?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
  }

  export type SearchAnalyticsAvgOrderByAggregateInput = {
    resultsCount?: SortOrder
  }

  export type SearchAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    query?: SortOrder
    resultsCount?: SortOrder
    clickedProductId?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
  }

  export type SearchAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    query?: SortOrder
    resultsCount?: SortOrder
    clickedProductId?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
  }

  export type SearchAnalyticsSumOrderByAggregateInput = {
    resultsCount?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryAnalyticsCreatetopProductIdsInput = {
    set: string[]
  }

  export type CategoryAnalyticsUpdatetopProductIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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
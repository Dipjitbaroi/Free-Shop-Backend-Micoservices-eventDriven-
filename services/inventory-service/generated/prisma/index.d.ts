
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
 * Model Inventory
 * 
 */
export type Inventory = $Result.DefaultSelection<Prisma.$InventoryPayload>
/**
 * Model StockReservation
 * 
 */
export type StockReservation = $Result.DefaultSelection<Prisma.$StockReservationPayload>
/**
 * Model StockMovement
 * 
 */
export type StockMovement = $Result.DefaultSelection<Prisma.$StockMovementPayload>
/**
 * Model InventoryAlert
 * 
 */
export type InventoryAlert = $Result.DefaultSelection<Prisma.$InventoryAlertPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ReservationStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FULFILLED: 'FULFILLED',
  RELEASED: 'RELEASED',
  EXPIRED: 'EXPIRED'
};

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]


export const MovementType: {
  RESTOCK: 'RESTOCK',
  SALE: 'SALE',
  RETURN: 'RETURN',
  ADJUSTMENT: 'ADJUSTMENT',
  RESERVATION: 'RESERVATION',
  RELEASE: 'RELEASE',
  INITIAL: 'INITIAL'
};

export type MovementType = (typeof MovementType)[keyof typeof MovementType]


export const AlertType: {
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  BACK_IN_STOCK: 'BACK_IN_STOCK',
  RESERVATION_EXPIRED: 'RESERVATION_EXPIRED'
};

export type AlertType = (typeof AlertType)[keyof typeof AlertType]

}

export type ReservationStatus = $Enums.ReservationStatus

export const ReservationStatus: typeof $Enums.ReservationStatus

export type MovementType = $Enums.MovementType

export const MovementType: typeof $Enums.MovementType

export type AlertType = $Enums.AlertType

export const AlertType: typeof $Enums.AlertType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Inventories
 * const inventories = await prisma.inventory.findMany()
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
   * // Fetch zero or more Inventories
   * const inventories = await prisma.inventory.findMany()
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
   * `prisma.inventory`: Exposes CRUD operations for the **Inventory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventories
    * const inventories = await prisma.inventory.findMany()
    * ```
    */
  get inventory(): Prisma.InventoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockReservation`: Exposes CRUD operations for the **StockReservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockReservations
    * const stockReservations = await prisma.stockReservation.findMany()
    * ```
    */
  get stockReservation(): Prisma.StockReservationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockMovement`: Exposes CRUD operations for the **StockMovement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockMovements
    * const stockMovements = await prisma.stockMovement.findMany()
    * ```
    */
  get stockMovement(): Prisma.StockMovementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryAlert`: Exposes CRUD operations for the **InventoryAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryAlerts
    * const inventoryAlerts = await prisma.inventoryAlert.findMany()
    * ```
    */
  get inventoryAlert(): Prisma.InventoryAlertDelegate<ExtArgs, ClientOptions>;
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
    Inventory: 'Inventory',
    StockReservation: 'StockReservation',
    StockMovement: 'StockMovement',
    InventoryAlert: 'InventoryAlert'
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
      modelProps: "inventory" | "stockReservation" | "stockMovement" | "inventoryAlert"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Inventory: {
        payload: Prisma.$InventoryPayload<ExtArgs>
        fields: Prisma.InventoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findFirst: {
            args: Prisma.InventoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findMany: {
            args: Prisma.InventoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          create: {
            args: Prisma.InventoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          createMany: {
            args: Prisma.InventoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          delete: {
            args: Prisma.InventoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          update: {
            args: Prisma.InventoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          deleteMany: {
            args: Prisma.InventoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          upsert: {
            args: Prisma.InventoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory>
          }
          groupBy: {
            args: Prisma.InventoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCountAggregateOutputType> | number
          }
        }
      }
      StockReservation: {
        payload: Prisma.$StockReservationPayload<ExtArgs>
        fields: Prisma.StockReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>
          }
          findFirst: {
            args: Prisma.StockReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>
          }
          findMany: {
            args: Prisma.StockReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>[]
          }
          create: {
            args: Prisma.StockReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>
          }
          createMany: {
            args: Prisma.StockReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>[]
          }
          delete: {
            args: Prisma.StockReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>
          }
          update: {
            args: Prisma.StockReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>
          }
          deleteMany: {
            args: Prisma.StockReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockReservationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>[]
          }
          upsert: {
            args: Prisma.StockReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockReservationPayload>
          }
          aggregate: {
            args: Prisma.StockReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockReservation>
          }
          groupBy: {
            args: Prisma.StockReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockReservationCountArgs<ExtArgs>
            result: $Utils.Optional<StockReservationCountAggregateOutputType> | number
          }
        }
      }
      StockMovement: {
        payload: Prisma.$StockMovementPayload<ExtArgs>
        fields: Prisma.StockMovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockMovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockMovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findFirst: {
            args: Prisma.StockMovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockMovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findMany: {
            args: Prisma.StockMovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          create: {
            args: Prisma.StockMovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          createMany: {
            args: Prisma.StockMovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockMovementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          delete: {
            args: Prisma.StockMovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          update: {
            args: Prisma.StockMovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          deleteMany: {
            args: Prisma.StockMovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockMovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockMovementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          upsert: {
            args: Prisma.StockMovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          aggregate: {
            args: Prisma.StockMovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockMovement>
          }
          groupBy: {
            args: Prisma.StockMovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockMovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockMovementCountArgs<ExtArgs>
            result: $Utils.Optional<StockMovementCountAggregateOutputType> | number
          }
        }
      }
      InventoryAlert: {
        payload: Prisma.$InventoryAlertPayload<ExtArgs>
        fields: Prisma.InventoryAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>
          }
          findFirst: {
            args: Prisma.InventoryAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>
          }
          findMany: {
            args: Prisma.InventoryAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>[]
          }
          create: {
            args: Prisma.InventoryAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>
          }
          createMany: {
            args: Prisma.InventoryAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>[]
          }
          delete: {
            args: Prisma.InventoryAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>
          }
          update: {
            args: Prisma.InventoryAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>
          }
          deleteMany: {
            args: Prisma.InventoryAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryAlertUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>[]
          }
          upsert: {
            args: Prisma.InventoryAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryAlertPayload>
          }
          aggregate: {
            args: Prisma.InventoryAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryAlert>
          }
          groupBy: {
            args: Prisma.InventoryAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryAlertCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryAlertCountAggregateOutputType> | number
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
    inventory?: InventoryOmit
    stockReservation?: StockReservationOmit
    stockMovement?: StockMovementOmit
    inventoryAlert?: InventoryAlertOmit
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
   * Count Type InventoryCountOutputType
   */

  export type InventoryCountOutputType = {
    reservations: number
    movements: number
  }

  export type InventoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | InventoryCountOutputTypeCountReservationsArgs
    movements?: boolean | InventoryCountOutputTypeCountMovementsArgs
  }

  // Custom InputTypes
  /**
   * InventoryCountOutputType without action
   */
  export type InventoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCountOutputType
     */
    select?: InventoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryCountOutputType without action
   */
  export type InventoryCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockReservationWhereInput
  }

  /**
   * InventoryCountOutputType without action
   */
  export type InventoryCountOutputTypeCountMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Inventory
   */

  export type AggregateInventory = {
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  export type InventoryAvgAggregateOutputType = {
    totalStock: number | null
    reservedStock: number | null
    availableStock: number | null
    lowStockThreshold: number | null
  }

  export type InventorySumAggregateOutputType = {
    totalStock: number | null
    reservedStock: number | null
    availableStock: number | null
    lowStockThreshold: number | null
  }

  export type InventoryMinAggregateOutputType = {
    id: string | null
    productId: string | null
    vendorId: string | null
    totalStock: number | null
    reservedStock: number | null
    availableStock: number | null
    lowStockThreshold: number | null
    isLowStock: boolean | null
    isOutOfStock: boolean | null
    lastRestockAt: Date | null
    lastSoldAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    vendorId: string | null
    totalStock: number | null
    reservedStock: number | null
    availableStock: number | null
    lowStockThreshold: number | null
    isLowStock: boolean | null
    isOutOfStock: boolean | null
    lastRestockAt: Date | null
    lastSoldAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryCountAggregateOutputType = {
    id: number
    productId: number
    vendorId: number
    totalStock: number
    reservedStock: number
    availableStock: number
    lowStockThreshold: number
    isLowStock: number
    isOutOfStock: number
    lastRestockAt: number
    lastSoldAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryAvgAggregateInputType = {
    totalStock?: true
    reservedStock?: true
    availableStock?: true
    lowStockThreshold?: true
  }

  export type InventorySumAggregateInputType = {
    totalStock?: true
    reservedStock?: true
    availableStock?: true
    lowStockThreshold?: true
  }

  export type InventoryMinAggregateInputType = {
    id?: true
    productId?: true
    vendorId?: true
    totalStock?: true
    reservedStock?: true
    availableStock?: true
    lowStockThreshold?: true
    isLowStock?: true
    isOutOfStock?: true
    lastRestockAt?: true
    lastSoldAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryMaxAggregateInputType = {
    id?: true
    productId?: true
    vendorId?: true
    totalStock?: true
    reservedStock?: true
    availableStock?: true
    lowStockThreshold?: true
    isLowStock?: true
    isOutOfStock?: true
    lastRestockAt?: true
    lastSoldAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryCountAggregateInputType = {
    id?: true
    productId?: true
    vendorId?: true
    totalStock?: true
    reservedStock?: true
    availableStock?: true
    lowStockThreshold?: true
    isLowStock?: true
    isOutOfStock?: true
    lastRestockAt?: true
    lastSoldAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventory to aggregate.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inventories
    **/
    _count?: true | InventoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMaxAggregateInputType
  }

  export type GetInventoryAggregateType<T extends InventoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory[P]>
      : GetScalarType<T[P], AggregateInventory[P]>
  }




  export type InventoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithAggregationInput | InventoryOrderByWithAggregationInput[]
    by: InventoryScalarFieldEnum[] | InventoryScalarFieldEnum
    having?: InventoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCountAggregateInputType | true
    _avg?: InventoryAvgAggregateInputType
    _sum?: InventorySumAggregateInputType
    _min?: InventoryMinAggregateInputType
    _max?: InventoryMaxAggregateInputType
  }

  export type InventoryGroupByOutputType = {
    id: string
    productId: string
    vendorId: string
    totalStock: number
    reservedStock: number
    availableStock: number
    lowStockThreshold: number
    isLowStock: boolean
    isOutOfStock: boolean
    lastRestockAt: Date | null
    lastSoldAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  type GetInventoryGroupByPayload<T extends InventoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryGroupByOutputType[P]>
        }
      >
    >


  export type InventorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    vendorId?: boolean
    totalStock?: boolean
    reservedStock?: boolean
    availableStock?: boolean
    lowStockThreshold?: boolean
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: boolean
    lastSoldAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reservations?: boolean | Inventory$reservationsArgs<ExtArgs>
    movements?: boolean | Inventory$movementsArgs<ExtArgs>
    _count?: boolean | InventoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    vendorId?: boolean
    totalStock?: boolean
    reservedStock?: boolean
    availableStock?: boolean
    lowStockThreshold?: boolean
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: boolean
    lastSoldAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    vendorId?: boolean
    totalStock?: boolean
    reservedStock?: boolean
    availableStock?: boolean
    lowStockThreshold?: boolean
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: boolean
    lastSoldAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectScalar = {
    id?: boolean
    productId?: boolean
    vendorId?: boolean
    totalStock?: boolean
    reservedStock?: boolean
    availableStock?: boolean
    lowStockThreshold?: boolean
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: boolean
    lastSoldAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "vendorId" | "totalStock" | "reservedStock" | "availableStock" | "lowStockThreshold" | "isLowStock" | "isOutOfStock" | "lastRestockAt" | "lastSoldAt" | "createdAt" | "updatedAt", ExtArgs["result"]["inventory"]>
  export type InventoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | Inventory$reservationsArgs<ExtArgs>
    movements?: boolean | Inventory$movementsArgs<ExtArgs>
    _count?: boolean | InventoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InventoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InventoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InventoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inventory"
    objects: {
      reservations: Prisma.$StockReservationPayload<ExtArgs>[]
      movements: Prisma.$StockMovementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      vendorId: string
      totalStock: number
      reservedStock: number
      availableStock: number
      lowStockThreshold: number
      isLowStock: boolean
      isOutOfStock: boolean
      lastRestockAt: Date | null
      lastSoldAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventory"]>
    composites: {}
  }

  type InventoryGetPayload<S extends boolean | null | undefined | InventoryDefaultArgs> = $Result.GetResult<Prisma.$InventoryPayload, S>

  type InventoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryCountAggregateInputType | true
    }

  export interface InventoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inventory'], meta: { name: 'Inventory' } }
    /**
     * Find zero or one Inventory that matches the filter.
     * @param {InventoryFindUniqueArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryFindUniqueArgs>(args: SelectSubset<T, InventoryFindUniqueArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryFindUniqueOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryFindFirstArgs>(args?: SelectSubset<T, InventoryFindFirstArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventories
     * const inventories = await prisma.inventory.findMany()
     * 
     * // Get first 10 Inventories
     * const inventories = await prisma.inventory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryWithIdOnly = await prisma.inventory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryFindManyArgs>(args?: SelectSubset<T, InventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventory.
     * @param {InventoryCreateArgs} args - Arguments to create a Inventory.
     * @example
     * // Create one Inventory
     * const Inventory = await prisma.inventory.create({
     *   data: {
     *     // ... data to create a Inventory
     *   }
     * })
     * 
     */
    create<T extends InventoryCreateArgs>(args: SelectSubset<T, InventoryCreateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventories.
     * @param {InventoryCreateManyArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryCreateManyArgs>(args?: SelectSubset<T, InventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventories and returns the data saved in the database.
     * @param {InventoryCreateManyAndReturnArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inventory.
     * @param {InventoryDeleteArgs} args - Arguments to delete one Inventory.
     * @example
     * // Delete one Inventory
     * const Inventory = await prisma.inventory.delete({
     *   where: {
     *     // ... filter to delete one Inventory
     *   }
     * })
     * 
     */
    delete<T extends InventoryDeleteArgs>(args: SelectSubset<T, InventoryDeleteArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventory.
     * @param {InventoryUpdateArgs} args - Arguments to update one Inventory.
     * @example
     * // Update one Inventory
     * const inventory = await prisma.inventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryUpdateArgs>(args: SelectSubset<T, InventoryUpdateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventories.
     * @param {InventoryDeleteManyArgs} args - Arguments to filter Inventories to delete.
     * @example
     * // Delete a few Inventories
     * const { count } = await prisma.inventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryDeleteManyArgs>(args?: SelectSubset<T, InventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryUpdateManyArgs>(args: SelectSubset<T, InventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories and returns the data updated in the database.
     * @param {InventoryUpdateManyAndReturnArgs} args - Arguments to update many Inventories.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.updateManyAndReturn({
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
    updateManyAndReturn<T extends InventoryUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inventory.
     * @param {InventoryUpsertArgs} args - Arguments to update or create a Inventory.
     * @example
     * // Update or create a Inventory
     * const inventory = await prisma.inventory.upsert({
     *   create: {
     *     // ... data to create a Inventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory we want to update
     *   }
     * })
     */
    upsert<T extends InventoryUpsertArgs>(args: SelectSubset<T, InventoryUpsertArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCountArgs} args - Arguments to filter Inventories to count.
     * @example
     * // Count the number of Inventories
     * const count = await prisma.inventory.count({
     *   where: {
     *     // ... the filter for the Inventories we want to count
     *   }
     * })
    **/
    count<T extends InventoryCountArgs>(
      args?: Subset<T, InventoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryAggregateArgs>(args: Subset<T, InventoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryAggregateType<T>>

    /**
     * Group by Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryGroupByArgs} args - Group by arguments.
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
      T extends InventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryGroupByArgs['orderBy'] }
        : { orderBy?: InventoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inventory model
   */
  readonly fields: InventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservations<T extends Inventory$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, Inventory$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    movements<T extends Inventory$movementsArgs<ExtArgs> = {}>(args?: Subset<T, Inventory$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Inventory model
   */
  interface InventoryFieldRefs {
    readonly id: FieldRef<"Inventory", 'String'>
    readonly productId: FieldRef<"Inventory", 'String'>
    readonly vendorId: FieldRef<"Inventory", 'String'>
    readonly totalStock: FieldRef<"Inventory", 'Int'>
    readonly reservedStock: FieldRef<"Inventory", 'Int'>
    readonly availableStock: FieldRef<"Inventory", 'Int'>
    readonly lowStockThreshold: FieldRef<"Inventory", 'Int'>
    readonly isLowStock: FieldRef<"Inventory", 'Boolean'>
    readonly isOutOfStock: FieldRef<"Inventory", 'Boolean'>
    readonly lastRestockAt: FieldRef<"Inventory", 'DateTime'>
    readonly lastSoldAt: FieldRef<"Inventory", 'DateTime'>
    readonly createdAt: FieldRef<"Inventory", 'DateTime'>
    readonly updatedAt: FieldRef<"Inventory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inventory findUnique
   */
  export type InventoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findUniqueOrThrow
   */
  export type InventoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findFirst
   */
  export type InventoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findFirstOrThrow
   */
  export type InventoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findMany
   */
  export type InventoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventories to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory create
   */
  export type InventoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Inventory.
     */
    data: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
  }

  /**
   * Inventory createMany
   */
  export type InventoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory createManyAndReturn
   */
  export type InventoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory update
   */
  export type InventoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Inventory.
     */
    data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
    /**
     * Choose, which Inventory to update.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory updateMany
   */
  export type InventoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to update.
     */
    limit?: number
  }

  /**
   * Inventory updateManyAndReturn
   */
  export type InventoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to update.
     */
    limit?: number
  }

  /**
   * Inventory upsert
   */
  export type InventoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Inventory to update in case it exists.
     */
    where: InventoryWhereUniqueInput
    /**
     * In case the Inventory found by the `where` argument doesn't exist, create a new Inventory with this data.
     */
    create: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
    /**
     * In case the Inventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
  }

  /**
   * Inventory delete
   */
  export type InventoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter which Inventory to delete.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory deleteMany
   */
  export type InventoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventories to delete
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to delete.
     */
    limit?: number
  }

  /**
   * Inventory.reservations
   */
  export type Inventory$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    where?: StockReservationWhereInput
    orderBy?: StockReservationOrderByWithRelationInput | StockReservationOrderByWithRelationInput[]
    cursor?: StockReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockReservationScalarFieldEnum | StockReservationScalarFieldEnum[]
  }

  /**
   * Inventory.movements
   */
  export type Inventory$movementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    cursor?: StockMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * Inventory without action
   */
  export type InventoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
  }


  /**
   * Model StockReservation
   */

  export type AggregateStockReservation = {
    _count: StockReservationCountAggregateOutputType | null
    _avg: StockReservationAvgAggregateOutputType | null
    _sum: StockReservationSumAggregateOutputType | null
    _min: StockReservationMinAggregateOutputType | null
    _max: StockReservationMaxAggregateOutputType | null
  }

  export type StockReservationAvgAggregateOutputType = {
    quantity: number | null
  }

  export type StockReservationSumAggregateOutputType = {
    quantity: number | null
  }

  export type StockReservationMinAggregateOutputType = {
    id: string | null
    inventoryId: string | null
    orderId: string | null
    quantity: number | null
    status: $Enums.ReservationStatus | null
    expiresAt: Date | null
    releasedAt: Date | null
    fulfilledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StockReservationMaxAggregateOutputType = {
    id: string | null
    inventoryId: string | null
    orderId: string | null
    quantity: number | null
    status: $Enums.ReservationStatus | null
    expiresAt: Date | null
    releasedAt: Date | null
    fulfilledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StockReservationCountAggregateOutputType = {
    id: number
    inventoryId: number
    orderId: number
    quantity: number
    status: number
    expiresAt: number
    releasedAt: number
    fulfilledAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StockReservationAvgAggregateInputType = {
    quantity?: true
  }

  export type StockReservationSumAggregateInputType = {
    quantity?: true
  }

  export type StockReservationMinAggregateInputType = {
    id?: true
    inventoryId?: true
    orderId?: true
    quantity?: true
    status?: true
    expiresAt?: true
    releasedAt?: true
    fulfilledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StockReservationMaxAggregateInputType = {
    id?: true
    inventoryId?: true
    orderId?: true
    quantity?: true
    status?: true
    expiresAt?: true
    releasedAt?: true
    fulfilledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StockReservationCountAggregateInputType = {
    id?: true
    inventoryId?: true
    orderId?: true
    quantity?: true
    status?: true
    expiresAt?: true
    releasedAt?: true
    fulfilledAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StockReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockReservation to aggregate.
     */
    where?: StockReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockReservations to fetch.
     */
    orderBy?: StockReservationOrderByWithRelationInput | StockReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockReservations
    **/
    _count?: true | StockReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockReservationMaxAggregateInputType
  }

  export type GetStockReservationAggregateType<T extends StockReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateStockReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockReservation[P]>
      : GetScalarType<T[P], AggregateStockReservation[P]>
  }




  export type StockReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockReservationWhereInput
    orderBy?: StockReservationOrderByWithAggregationInput | StockReservationOrderByWithAggregationInput[]
    by: StockReservationScalarFieldEnum[] | StockReservationScalarFieldEnum
    having?: StockReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockReservationCountAggregateInputType | true
    _avg?: StockReservationAvgAggregateInputType
    _sum?: StockReservationSumAggregateInputType
    _min?: StockReservationMinAggregateInputType
    _max?: StockReservationMaxAggregateInputType
  }

  export type StockReservationGroupByOutputType = {
    id: string
    inventoryId: string
    orderId: string
    quantity: number
    status: $Enums.ReservationStatus
    expiresAt: Date | null
    releasedAt: Date | null
    fulfilledAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: StockReservationCountAggregateOutputType | null
    _avg: StockReservationAvgAggregateOutputType | null
    _sum: StockReservationSumAggregateOutputType | null
    _min: StockReservationMinAggregateOutputType | null
    _max: StockReservationMaxAggregateOutputType | null
  }

  type GetStockReservationGroupByPayload<T extends StockReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockReservationGroupByOutputType[P]>
            : GetScalarType<T[P], StockReservationGroupByOutputType[P]>
        }
      >
    >


  export type StockReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    orderId?: boolean
    quantity?: boolean
    status?: boolean
    expiresAt?: boolean
    releasedAt?: boolean
    fulfilledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockReservation"]>

  export type StockReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    orderId?: boolean
    quantity?: boolean
    status?: boolean
    expiresAt?: boolean
    releasedAt?: boolean
    fulfilledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockReservation"]>

  export type StockReservationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    orderId?: boolean
    quantity?: boolean
    status?: boolean
    expiresAt?: boolean
    releasedAt?: boolean
    fulfilledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockReservation"]>

  export type StockReservationSelectScalar = {
    id?: boolean
    inventoryId?: boolean
    orderId?: boolean
    quantity?: boolean
    status?: boolean
    expiresAt?: boolean
    releasedAt?: boolean
    fulfilledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StockReservationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "inventoryId" | "orderId" | "quantity" | "status" | "expiresAt" | "releasedAt" | "fulfilledAt" | "createdAt" | "updatedAt", ExtArgs["result"]["stockReservation"]>
  export type StockReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }
  export type StockReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }
  export type StockReservationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }

  export type $StockReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockReservation"
    objects: {
      inventory: Prisma.$InventoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      inventoryId: string
      orderId: string
      quantity: number
      status: $Enums.ReservationStatus
      expiresAt: Date | null
      releasedAt: Date | null
      fulfilledAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["stockReservation"]>
    composites: {}
  }

  type StockReservationGetPayload<S extends boolean | null | undefined | StockReservationDefaultArgs> = $Result.GetResult<Prisma.$StockReservationPayload, S>

  type StockReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockReservationCountAggregateInputType | true
    }

  export interface StockReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockReservation'], meta: { name: 'StockReservation' } }
    /**
     * Find zero or one StockReservation that matches the filter.
     * @param {StockReservationFindUniqueArgs} args - Arguments to find a StockReservation
     * @example
     * // Get one StockReservation
     * const stockReservation = await prisma.stockReservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockReservationFindUniqueArgs>(args: SelectSubset<T, StockReservationFindUniqueArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockReservation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockReservationFindUniqueOrThrowArgs} args - Arguments to find a StockReservation
     * @example
     * // Get one StockReservation
     * const stockReservation = await prisma.stockReservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, StockReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockReservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationFindFirstArgs} args - Arguments to find a StockReservation
     * @example
     * // Get one StockReservation
     * const stockReservation = await prisma.stockReservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockReservationFindFirstArgs>(args?: SelectSubset<T, StockReservationFindFirstArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockReservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationFindFirstOrThrowArgs} args - Arguments to find a StockReservation
     * @example
     * // Get one StockReservation
     * const stockReservation = await prisma.stockReservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, StockReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockReservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockReservations
     * const stockReservations = await prisma.stockReservation.findMany()
     * 
     * // Get first 10 StockReservations
     * const stockReservations = await prisma.stockReservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockReservationWithIdOnly = await prisma.stockReservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockReservationFindManyArgs>(args?: SelectSubset<T, StockReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockReservation.
     * @param {StockReservationCreateArgs} args - Arguments to create a StockReservation.
     * @example
     * // Create one StockReservation
     * const StockReservation = await prisma.stockReservation.create({
     *   data: {
     *     // ... data to create a StockReservation
     *   }
     * })
     * 
     */
    create<T extends StockReservationCreateArgs>(args: SelectSubset<T, StockReservationCreateArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockReservations.
     * @param {StockReservationCreateManyArgs} args - Arguments to create many StockReservations.
     * @example
     * // Create many StockReservations
     * const stockReservation = await prisma.stockReservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockReservationCreateManyArgs>(args?: SelectSubset<T, StockReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockReservations and returns the data saved in the database.
     * @param {StockReservationCreateManyAndReturnArgs} args - Arguments to create many StockReservations.
     * @example
     * // Create many StockReservations
     * const stockReservation = await prisma.stockReservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockReservations and only return the `id`
     * const stockReservationWithIdOnly = await prisma.stockReservation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, StockReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockReservation.
     * @param {StockReservationDeleteArgs} args - Arguments to delete one StockReservation.
     * @example
     * // Delete one StockReservation
     * const StockReservation = await prisma.stockReservation.delete({
     *   where: {
     *     // ... filter to delete one StockReservation
     *   }
     * })
     * 
     */
    delete<T extends StockReservationDeleteArgs>(args: SelectSubset<T, StockReservationDeleteArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockReservation.
     * @param {StockReservationUpdateArgs} args - Arguments to update one StockReservation.
     * @example
     * // Update one StockReservation
     * const stockReservation = await prisma.stockReservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockReservationUpdateArgs>(args: SelectSubset<T, StockReservationUpdateArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockReservations.
     * @param {StockReservationDeleteManyArgs} args - Arguments to filter StockReservations to delete.
     * @example
     * // Delete a few StockReservations
     * const { count } = await prisma.stockReservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockReservationDeleteManyArgs>(args?: SelectSubset<T, StockReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockReservations
     * const stockReservation = await prisma.stockReservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockReservationUpdateManyArgs>(args: SelectSubset<T, StockReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockReservations and returns the data updated in the database.
     * @param {StockReservationUpdateManyAndReturnArgs} args - Arguments to update many StockReservations.
     * @example
     * // Update many StockReservations
     * const stockReservation = await prisma.stockReservation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockReservations and only return the `id`
     * const stockReservationWithIdOnly = await prisma.stockReservation.updateManyAndReturn({
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
    updateManyAndReturn<T extends StockReservationUpdateManyAndReturnArgs>(args: SelectSubset<T, StockReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockReservation.
     * @param {StockReservationUpsertArgs} args - Arguments to update or create a StockReservation.
     * @example
     * // Update or create a StockReservation
     * const stockReservation = await prisma.stockReservation.upsert({
     *   create: {
     *     // ... data to create a StockReservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockReservation we want to update
     *   }
     * })
     */
    upsert<T extends StockReservationUpsertArgs>(args: SelectSubset<T, StockReservationUpsertArgs<ExtArgs>>): Prisma__StockReservationClient<$Result.GetResult<Prisma.$StockReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationCountArgs} args - Arguments to filter StockReservations to count.
     * @example
     * // Count the number of StockReservations
     * const count = await prisma.stockReservation.count({
     *   where: {
     *     // ... the filter for the StockReservations we want to count
     *   }
     * })
    **/
    count<T extends StockReservationCountArgs>(
      args?: Subset<T, StockReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StockReservationAggregateArgs>(args: Subset<T, StockReservationAggregateArgs>): Prisma.PrismaPromise<GetStockReservationAggregateType<T>>

    /**
     * Group by StockReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockReservationGroupByArgs} args - Group by arguments.
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
      T extends StockReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockReservationGroupByArgs['orderBy'] }
        : { orderBy?: StockReservationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StockReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockReservation model
   */
  readonly fields: StockReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockReservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inventory<T extends InventoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryDefaultArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the StockReservation model
   */
  interface StockReservationFieldRefs {
    readonly id: FieldRef<"StockReservation", 'String'>
    readonly inventoryId: FieldRef<"StockReservation", 'String'>
    readonly orderId: FieldRef<"StockReservation", 'String'>
    readonly quantity: FieldRef<"StockReservation", 'Int'>
    readonly status: FieldRef<"StockReservation", 'ReservationStatus'>
    readonly expiresAt: FieldRef<"StockReservation", 'DateTime'>
    readonly releasedAt: FieldRef<"StockReservation", 'DateTime'>
    readonly fulfilledAt: FieldRef<"StockReservation", 'DateTime'>
    readonly createdAt: FieldRef<"StockReservation", 'DateTime'>
    readonly updatedAt: FieldRef<"StockReservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StockReservation findUnique
   */
  export type StockReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * Filter, which StockReservation to fetch.
     */
    where: StockReservationWhereUniqueInput
  }

  /**
   * StockReservation findUniqueOrThrow
   */
  export type StockReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * Filter, which StockReservation to fetch.
     */
    where: StockReservationWhereUniqueInput
  }

  /**
   * StockReservation findFirst
   */
  export type StockReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * Filter, which StockReservation to fetch.
     */
    where?: StockReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockReservations to fetch.
     */
    orderBy?: StockReservationOrderByWithRelationInput | StockReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockReservations.
     */
    cursor?: StockReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockReservations.
     */
    distinct?: StockReservationScalarFieldEnum | StockReservationScalarFieldEnum[]
  }

  /**
   * StockReservation findFirstOrThrow
   */
  export type StockReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * Filter, which StockReservation to fetch.
     */
    where?: StockReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockReservations to fetch.
     */
    orderBy?: StockReservationOrderByWithRelationInput | StockReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockReservations.
     */
    cursor?: StockReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockReservations.
     */
    distinct?: StockReservationScalarFieldEnum | StockReservationScalarFieldEnum[]
  }

  /**
   * StockReservation findMany
   */
  export type StockReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * Filter, which StockReservations to fetch.
     */
    where?: StockReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockReservations to fetch.
     */
    orderBy?: StockReservationOrderByWithRelationInput | StockReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockReservations.
     */
    cursor?: StockReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockReservations.
     */
    distinct?: StockReservationScalarFieldEnum | StockReservationScalarFieldEnum[]
  }

  /**
   * StockReservation create
   */
  export type StockReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a StockReservation.
     */
    data: XOR<StockReservationCreateInput, StockReservationUncheckedCreateInput>
  }

  /**
   * StockReservation createMany
   */
  export type StockReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockReservations.
     */
    data: StockReservationCreateManyInput | StockReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockReservation createManyAndReturn
   */
  export type StockReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * The data used to create many StockReservations.
     */
    data: StockReservationCreateManyInput | StockReservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockReservation update
   */
  export type StockReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a StockReservation.
     */
    data: XOR<StockReservationUpdateInput, StockReservationUncheckedUpdateInput>
    /**
     * Choose, which StockReservation to update.
     */
    where: StockReservationWhereUniqueInput
  }

  /**
   * StockReservation updateMany
   */
  export type StockReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockReservations.
     */
    data: XOR<StockReservationUpdateManyMutationInput, StockReservationUncheckedUpdateManyInput>
    /**
     * Filter which StockReservations to update
     */
    where?: StockReservationWhereInput
    /**
     * Limit how many StockReservations to update.
     */
    limit?: number
  }

  /**
   * StockReservation updateManyAndReturn
   */
  export type StockReservationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * The data used to update StockReservations.
     */
    data: XOR<StockReservationUpdateManyMutationInput, StockReservationUncheckedUpdateManyInput>
    /**
     * Filter which StockReservations to update
     */
    where?: StockReservationWhereInput
    /**
     * Limit how many StockReservations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockReservation upsert
   */
  export type StockReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the StockReservation to update in case it exists.
     */
    where: StockReservationWhereUniqueInput
    /**
     * In case the StockReservation found by the `where` argument doesn't exist, create a new StockReservation with this data.
     */
    create: XOR<StockReservationCreateInput, StockReservationUncheckedCreateInput>
    /**
     * In case the StockReservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockReservationUpdateInput, StockReservationUncheckedUpdateInput>
  }

  /**
   * StockReservation delete
   */
  export type StockReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
    /**
     * Filter which StockReservation to delete.
     */
    where: StockReservationWhereUniqueInput
  }

  /**
   * StockReservation deleteMany
   */
  export type StockReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockReservations to delete
     */
    where?: StockReservationWhereInput
    /**
     * Limit how many StockReservations to delete.
     */
    limit?: number
  }

  /**
   * StockReservation without action
   */
  export type StockReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockReservation
     */
    select?: StockReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockReservation
     */
    omit?: StockReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockReservationInclude<ExtArgs> | null
  }


  /**
   * Model StockMovement
   */

  export type AggregateStockMovement = {
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  export type StockMovementAvgAggregateOutputType = {
    quantity: number | null
    previousStock: number | null
    newStock: number | null
  }

  export type StockMovementSumAggregateOutputType = {
    quantity: number | null
    previousStock: number | null
    newStock: number | null
  }

  export type StockMovementMinAggregateOutputType = {
    id: string | null
    inventoryId: string | null
    type: $Enums.MovementType | null
    quantity: number | null
    reason: string | null
    reference: string | null
    previousStock: number | null
    newStock: number | null
    performedBy: string | null
    createdAt: Date | null
  }

  export type StockMovementMaxAggregateOutputType = {
    id: string | null
    inventoryId: string | null
    type: $Enums.MovementType | null
    quantity: number | null
    reason: string | null
    reference: string | null
    previousStock: number | null
    newStock: number | null
    performedBy: string | null
    createdAt: Date | null
  }

  export type StockMovementCountAggregateOutputType = {
    id: number
    inventoryId: number
    type: number
    quantity: number
    reason: number
    reference: number
    previousStock: number
    newStock: number
    performedBy: number
    createdAt: number
    _all: number
  }


  export type StockMovementAvgAggregateInputType = {
    quantity?: true
    previousStock?: true
    newStock?: true
  }

  export type StockMovementSumAggregateInputType = {
    quantity?: true
    previousStock?: true
    newStock?: true
  }

  export type StockMovementMinAggregateInputType = {
    id?: true
    inventoryId?: true
    type?: true
    quantity?: true
    reason?: true
    reference?: true
    previousStock?: true
    newStock?: true
    performedBy?: true
    createdAt?: true
  }

  export type StockMovementMaxAggregateInputType = {
    id?: true
    inventoryId?: true
    type?: true
    quantity?: true
    reason?: true
    reference?: true
    previousStock?: true
    newStock?: true
    performedBy?: true
    createdAt?: true
  }

  export type StockMovementCountAggregateInputType = {
    id?: true
    inventoryId?: true
    type?: true
    quantity?: true
    reason?: true
    reference?: true
    previousStock?: true
    newStock?: true
    performedBy?: true
    createdAt?: true
    _all?: true
  }

  export type StockMovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovement to aggregate.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockMovements
    **/
    _count?: true | StockMovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockMovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockMovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockMovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockMovementMaxAggregateInputType
  }

  export type GetStockMovementAggregateType<T extends StockMovementAggregateArgs> = {
        [P in keyof T & keyof AggregateStockMovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockMovement[P]>
      : GetScalarType<T[P], AggregateStockMovement[P]>
  }




  export type StockMovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithAggregationInput | StockMovementOrderByWithAggregationInput[]
    by: StockMovementScalarFieldEnum[] | StockMovementScalarFieldEnum
    having?: StockMovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockMovementCountAggregateInputType | true
    _avg?: StockMovementAvgAggregateInputType
    _sum?: StockMovementSumAggregateInputType
    _min?: StockMovementMinAggregateInputType
    _max?: StockMovementMaxAggregateInputType
  }

  export type StockMovementGroupByOutputType = {
    id: string
    inventoryId: string
    type: $Enums.MovementType
    quantity: number
    reason: string | null
    reference: string | null
    previousStock: number
    newStock: number
    performedBy: string | null
    createdAt: Date
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  type GetStockMovementGroupByPayload<T extends StockMovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockMovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockMovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
            : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
        }
      >
    >


  export type StockMovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    type?: boolean
    quantity?: boolean
    reason?: boolean
    reference?: boolean
    previousStock?: boolean
    newStock?: boolean
    performedBy?: boolean
    createdAt?: boolean
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    type?: boolean
    quantity?: boolean
    reason?: boolean
    reference?: boolean
    previousStock?: boolean
    newStock?: boolean
    performedBy?: boolean
    createdAt?: boolean
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    type?: boolean
    quantity?: boolean
    reason?: boolean
    reference?: boolean
    previousStock?: boolean
    newStock?: boolean
    performedBy?: boolean
    createdAt?: boolean
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectScalar = {
    id?: boolean
    inventoryId?: boolean
    type?: boolean
    quantity?: boolean
    reason?: boolean
    reference?: boolean
    previousStock?: boolean
    newStock?: boolean
    performedBy?: boolean
    createdAt?: boolean
  }

  export type StockMovementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "inventoryId" | "type" | "quantity" | "reason" | "reference" | "previousStock" | "newStock" | "performedBy" | "createdAt", ExtArgs["result"]["stockMovement"]>
  export type StockMovementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }
  export type StockMovementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }
  export type StockMovementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }

  export type $StockMovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockMovement"
    objects: {
      inventory: Prisma.$InventoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      inventoryId: string
      type: $Enums.MovementType
      quantity: number
      reason: string | null
      reference: string | null
      previousStock: number
      newStock: number
      performedBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["stockMovement"]>
    composites: {}
  }

  type StockMovementGetPayload<S extends boolean | null | undefined | StockMovementDefaultArgs> = $Result.GetResult<Prisma.$StockMovementPayload, S>

  type StockMovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockMovementCountAggregateInputType | true
    }

  export interface StockMovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockMovement'], meta: { name: 'StockMovement' } }
    /**
     * Find zero or one StockMovement that matches the filter.
     * @param {StockMovementFindUniqueArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockMovementFindUniqueArgs>(args: SelectSubset<T, StockMovementFindUniqueArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockMovement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockMovementFindUniqueOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockMovementFindUniqueOrThrowArgs>(args: SelectSubset<T, StockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockMovement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockMovementFindFirstArgs>(args?: SelectSubset<T, StockMovementFindFirstArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockMovement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockMovementFindFirstOrThrowArgs>(args?: SelectSubset<T, StockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockMovements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockMovements
     * const stockMovements = await prisma.stockMovement.findMany()
     * 
     * // Get first 10 StockMovements
     * const stockMovements = await prisma.stockMovement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockMovementFindManyArgs>(args?: SelectSubset<T, StockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockMovement.
     * @param {StockMovementCreateArgs} args - Arguments to create a StockMovement.
     * @example
     * // Create one StockMovement
     * const StockMovement = await prisma.stockMovement.create({
     *   data: {
     *     // ... data to create a StockMovement
     *   }
     * })
     * 
     */
    create<T extends StockMovementCreateArgs>(args: SelectSubset<T, StockMovementCreateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockMovements.
     * @param {StockMovementCreateManyArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockMovementCreateManyArgs>(args?: SelectSubset<T, StockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockMovements and returns the data saved in the database.
     * @param {StockMovementCreateManyAndReturnArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockMovements and only return the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockMovementCreateManyAndReturnArgs>(args?: SelectSubset<T, StockMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockMovement.
     * @param {StockMovementDeleteArgs} args - Arguments to delete one StockMovement.
     * @example
     * // Delete one StockMovement
     * const StockMovement = await prisma.stockMovement.delete({
     *   where: {
     *     // ... filter to delete one StockMovement
     *   }
     * })
     * 
     */
    delete<T extends StockMovementDeleteArgs>(args: SelectSubset<T, StockMovementDeleteArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockMovement.
     * @param {StockMovementUpdateArgs} args - Arguments to update one StockMovement.
     * @example
     * // Update one StockMovement
     * const stockMovement = await prisma.stockMovement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockMovementUpdateArgs>(args: SelectSubset<T, StockMovementUpdateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockMovements.
     * @param {StockMovementDeleteManyArgs} args - Arguments to filter StockMovements to delete.
     * @example
     * // Delete a few StockMovements
     * const { count } = await prisma.stockMovement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockMovementDeleteManyArgs>(args?: SelectSubset<T, StockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockMovements
     * const stockMovement = await prisma.stockMovement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockMovementUpdateManyArgs>(args: SelectSubset<T, StockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockMovements and returns the data updated in the database.
     * @param {StockMovementUpdateManyAndReturnArgs} args - Arguments to update many StockMovements.
     * @example
     * // Update many StockMovements
     * const stockMovement = await prisma.stockMovement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockMovements and only return the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.updateManyAndReturn({
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
    updateManyAndReturn<T extends StockMovementUpdateManyAndReturnArgs>(args: SelectSubset<T, StockMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockMovement.
     * @param {StockMovementUpsertArgs} args - Arguments to update or create a StockMovement.
     * @example
     * // Update or create a StockMovement
     * const stockMovement = await prisma.stockMovement.upsert({
     *   create: {
     *     // ... data to create a StockMovement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockMovement we want to update
     *   }
     * })
     */
    upsert<T extends StockMovementUpsertArgs>(args: SelectSubset<T, StockMovementUpsertArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementCountArgs} args - Arguments to filter StockMovements to count.
     * @example
     * // Count the number of StockMovements
     * const count = await prisma.stockMovement.count({
     *   where: {
     *     // ... the filter for the StockMovements we want to count
     *   }
     * })
    **/
    count<T extends StockMovementCountArgs>(
      args?: Subset<T, StockMovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockMovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StockMovementAggregateArgs>(args: Subset<T, StockMovementAggregateArgs>): Prisma.PrismaPromise<GetStockMovementAggregateType<T>>

    /**
     * Group by StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementGroupByArgs} args - Group by arguments.
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
      T extends StockMovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockMovementGroupByArgs['orderBy'] }
        : { orderBy?: StockMovementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockMovement model
   */
  readonly fields: StockMovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockMovement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockMovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inventory<T extends InventoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryDefaultArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the StockMovement model
   */
  interface StockMovementFieldRefs {
    readonly id: FieldRef<"StockMovement", 'String'>
    readonly inventoryId: FieldRef<"StockMovement", 'String'>
    readonly type: FieldRef<"StockMovement", 'MovementType'>
    readonly quantity: FieldRef<"StockMovement", 'Int'>
    readonly reason: FieldRef<"StockMovement", 'String'>
    readonly reference: FieldRef<"StockMovement", 'String'>
    readonly previousStock: FieldRef<"StockMovement", 'Int'>
    readonly newStock: FieldRef<"StockMovement", 'Int'>
    readonly performedBy: FieldRef<"StockMovement", 'String'>
    readonly createdAt: FieldRef<"StockMovement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StockMovement findUnique
   */
  export type StockMovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findUniqueOrThrow
   */
  export type StockMovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findFirst
   */
  export type StockMovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findFirstOrThrow
   */
  export type StockMovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findMany
   */
  export type StockMovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovements to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement create
   */
  export type StockMovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to create a StockMovement.
     */
    data: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
  }

  /**
   * StockMovement createMany
   */
  export type StockMovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockMovement createManyAndReturn
   */
  export type StockMovementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockMovement update
   */
  export type StockMovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to update a StockMovement.
     */
    data: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
    /**
     * Choose, which StockMovement to update.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement updateMany
   */
  export type StockMovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockMovements.
     */
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyInput>
    /**
     * Filter which StockMovements to update
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to update.
     */
    limit?: number
  }

  /**
   * StockMovement updateManyAndReturn
   */
  export type StockMovementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * The data used to update StockMovements.
     */
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyInput>
    /**
     * Filter which StockMovements to update
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockMovement upsert
   */
  export type StockMovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The filter to search for the StockMovement to update in case it exists.
     */
    where: StockMovementWhereUniqueInput
    /**
     * In case the StockMovement found by the `where` argument doesn't exist, create a new StockMovement with this data.
     */
    create: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
    /**
     * In case the StockMovement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
  }

  /**
   * StockMovement delete
   */
  export type StockMovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter which StockMovement to delete.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement deleteMany
   */
  export type StockMovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovements to delete
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to delete.
     */
    limit?: number
  }

  /**
   * StockMovement without action
   */
  export type StockMovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
  }


  /**
   * Model InventoryAlert
   */

  export type AggregateInventoryAlert = {
    _count: InventoryAlertCountAggregateOutputType | null
    _min: InventoryAlertMinAggregateOutputType | null
    _max: InventoryAlertMaxAggregateOutputType | null
  }

  export type InventoryAlertMinAggregateOutputType = {
    id: string | null
    inventoryId: string | null
    productId: string | null
    vendorId: string | null
    type: $Enums.AlertType | null
    message: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type InventoryAlertMaxAggregateOutputType = {
    id: string | null
    inventoryId: string | null
    productId: string | null
    vendorId: string | null
    type: $Enums.AlertType | null
    message: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type InventoryAlertCountAggregateOutputType = {
    id: number
    inventoryId: number
    productId: number
    vendorId: number
    type: number
    message: number
    isRead: number
    createdAt: number
    _all: number
  }


  export type InventoryAlertMinAggregateInputType = {
    id?: true
    inventoryId?: true
    productId?: true
    vendorId?: true
    type?: true
    message?: true
    isRead?: true
    createdAt?: true
  }

  export type InventoryAlertMaxAggregateInputType = {
    id?: true
    inventoryId?: true
    productId?: true
    vendorId?: true
    type?: true
    message?: true
    isRead?: true
    createdAt?: true
  }

  export type InventoryAlertCountAggregateInputType = {
    id?: true
    inventoryId?: true
    productId?: true
    vendorId?: true
    type?: true
    message?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type InventoryAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryAlert to aggregate.
     */
    where?: InventoryAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryAlerts to fetch.
     */
    orderBy?: InventoryAlertOrderByWithRelationInput | InventoryAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryAlerts
    **/
    _count?: true | InventoryAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryAlertMaxAggregateInputType
  }

  export type GetInventoryAlertAggregateType<T extends InventoryAlertAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryAlert[P]>
      : GetScalarType<T[P], AggregateInventoryAlert[P]>
  }




  export type InventoryAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryAlertWhereInput
    orderBy?: InventoryAlertOrderByWithAggregationInput | InventoryAlertOrderByWithAggregationInput[]
    by: InventoryAlertScalarFieldEnum[] | InventoryAlertScalarFieldEnum
    having?: InventoryAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryAlertCountAggregateInputType | true
    _min?: InventoryAlertMinAggregateInputType
    _max?: InventoryAlertMaxAggregateInputType
  }

  export type InventoryAlertGroupByOutputType = {
    id: string
    inventoryId: string
    productId: string
    vendorId: string
    type: $Enums.AlertType
    message: string
    isRead: boolean
    createdAt: Date
    _count: InventoryAlertCountAggregateOutputType | null
    _min: InventoryAlertMinAggregateOutputType | null
    _max: InventoryAlertMaxAggregateOutputType | null
  }

  type GetInventoryAlertGroupByPayload<T extends InventoryAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryAlertGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryAlertGroupByOutputType[P]>
        }
      >
    >


  export type InventoryAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    productId?: boolean
    vendorId?: boolean
    type?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryAlert"]>

  export type InventoryAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    productId?: boolean
    vendorId?: boolean
    type?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryAlert"]>

  export type InventoryAlertSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    inventoryId?: boolean
    productId?: boolean
    vendorId?: boolean
    type?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryAlert"]>

  export type InventoryAlertSelectScalar = {
    id?: boolean
    inventoryId?: boolean
    productId?: boolean
    vendorId?: boolean
    type?: boolean
    message?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type InventoryAlertOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "inventoryId" | "productId" | "vendorId" | "type" | "message" | "isRead" | "createdAt", ExtArgs["result"]["inventoryAlert"]>

  export type $InventoryAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryAlert"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      inventoryId: string
      productId: string
      vendorId: string
      type: $Enums.AlertType
      message: string
      isRead: boolean
      createdAt: Date
    }, ExtArgs["result"]["inventoryAlert"]>
    composites: {}
  }

  type InventoryAlertGetPayload<S extends boolean | null | undefined | InventoryAlertDefaultArgs> = $Result.GetResult<Prisma.$InventoryAlertPayload, S>

  type InventoryAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryAlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryAlertCountAggregateInputType | true
    }

  export interface InventoryAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryAlert'], meta: { name: 'InventoryAlert' } }
    /**
     * Find zero or one InventoryAlert that matches the filter.
     * @param {InventoryAlertFindUniqueArgs} args - Arguments to find a InventoryAlert
     * @example
     * // Get one InventoryAlert
     * const inventoryAlert = await prisma.inventoryAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryAlertFindUniqueArgs>(args: SelectSubset<T, InventoryAlertFindUniqueArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryAlert that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryAlertFindUniqueOrThrowArgs} args - Arguments to find a InventoryAlert
     * @example
     * // Get one InventoryAlert
     * const inventoryAlert = await prisma.inventoryAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertFindFirstArgs} args - Arguments to find a InventoryAlert
     * @example
     * // Get one InventoryAlert
     * const inventoryAlert = await prisma.inventoryAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryAlertFindFirstArgs>(args?: SelectSubset<T, InventoryAlertFindFirstArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertFindFirstOrThrowArgs} args - Arguments to find a InventoryAlert
     * @example
     * // Get one InventoryAlert
     * const inventoryAlert = await prisma.inventoryAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryAlerts
     * const inventoryAlerts = await prisma.inventoryAlert.findMany()
     * 
     * // Get first 10 InventoryAlerts
     * const inventoryAlerts = await prisma.inventoryAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryAlertWithIdOnly = await prisma.inventoryAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryAlertFindManyArgs>(args?: SelectSubset<T, InventoryAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryAlert.
     * @param {InventoryAlertCreateArgs} args - Arguments to create a InventoryAlert.
     * @example
     * // Create one InventoryAlert
     * const InventoryAlert = await prisma.inventoryAlert.create({
     *   data: {
     *     // ... data to create a InventoryAlert
     *   }
     * })
     * 
     */
    create<T extends InventoryAlertCreateArgs>(args: SelectSubset<T, InventoryAlertCreateArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryAlerts.
     * @param {InventoryAlertCreateManyArgs} args - Arguments to create many InventoryAlerts.
     * @example
     * // Create many InventoryAlerts
     * const inventoryAlert = await prisma.inventoryAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryAlertCreateManyArgs>(args?: SelectSubset<T, InventoryAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryAlerts and returns the data saved in the database.
     * @param {InventoryAlertCreateManyAndReturnArgs} args - Arguments to create many InventoryAlerts.
     * @example
     * // Create many InventoryAlerts
     * const inventoryAlert = await prisma.inventoryAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryAlerts and only return the `id`
     * const inventoryAlertWithIdOnly = await prisma.inventoryAlert.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InventoryAlert.
     * @param {InventoryAlertDeleteArgs} args - Arguments to delete one InventoryAlert.
     * @example
     * // Delete one InventoryAlert
     * const InventoryAlert = await prisma.inventoryAlert.delete({
     *   where: {
     *     // ... filter to delete one InventoryAlert
     *   }
     * })
     * 
     */
    delete<T extends InventoryAlertDeleteArgs>(args: SelectSubset<T, InventoryAlertDeleteArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryAlert.
     * @param {InventoryAlertUpdateArgs} args - Arguments to update one InventoryAlert.
     * @example
     * // Update one InventoryAlert
     * const inventoryAlert = await prisma.inventoryAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryAlertUpdateArgs>(args: SelectSubset<T, InventoryAlertUpdateArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryAlerts.
     * @param {InventoryAlertDeleteManyArgs} args - Arguments to filter InventoryAlerts to delete.
     * @example
     * // Delete a few InventoryAlerts
     * const { count } = await prisma.inventoryAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryAlertDeleteManyArgs>(args?: SelectSubset<T, InventoryAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryAlerts
     * const inventoryAlert = await prisma.inventoryAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryAlertUpdateManyArgs>(args: SelectSubset<T, InventoryAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryAlerts and returns the data updated in the database.
     * @param {InventoryAlertUpdateManyAndReturnArgs} args - Arguments to update many InventoryAlerts.
     * @example
     * // Update many InventoryAlerts
     * const inventoryAlert = await prisma.inventoryAlert.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InventoryAlerts and only return the `id`
     * const inventoryAlertWithIdOnly = await prisma.inventoryAlert.updateManyAndReturn({
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
    updateManyAndReturn<T extends InventoryAlertUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryAlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InventoryAlert.
     * @param {InventoryAlertUpsertArgs} args - Arguments to update or create a InventoryAlert.
     * @example
     * // Update or create a InventoryAlert
     * const inventoryAlert = await prisma.inventoryAlert.upsert({
     *   create: {
     *     // ... data to create a InventoryAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryAlert we want to update
     *   }
     * })
     */
    upsert<T extends InventoryAlertUpsertArgs>(args: SelectSubset<T, InventoryAlertUpsertArgs<ExtArgs>>): Prisma__InventoryAlertClient<$Result.GetResult<Prisma.$InventoryAlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertCountArgs} args - Arguments to filter InventoryAlerts to count.
     * @example
     * // Count the number of InventoryAlerts
     * const count = await prisma.inventoryAlert.count({
     *   where: {
     *     // ... the filter for the InventoryAlerts we want to count
     *   }
     * })
    **/
    count<T extends InventoryAlertCountArgs>(
      args?: Subset<T, InventoryAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryAlertAggregateArgs>(args: Subset<T, InventoryAlertAggregateArgs>): Prisma.PrismaPromise<GetInventoryAlertAggregateType<T>>

    /**
     * Group by InventoryAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAlertGroupByArgs} args - Group by arguments.
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
      T extends InventoryAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryAlertGroupByArgs['orderBy'] }
        : { orderBy?: InventoryAlertGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryAlert model
   */
  readonly fields: InventoryAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the InventoryAlert model
   */
  interface InventoryAlertFieldRefs {
    readonly id: FieldRef<"InventoryAlert", 'String'>
    readonly inventoryId: FieldRef<"InventoryAlert", 'String'>
    readonly productId: FieldRef<"InventoryAlert", 'String'>
    readonly vendorId: FieldRef<"InventoryAlert", 'String'>
    readonly type: FieldRef<"InventoryAlert", 'AlertType'>
    readonly message: FieldRef<"InventoryAlert", 'String'>
    readonly isRead: FieldRef<"InventoryAlert", 'Boolean'>
    readonly createdAt: FieldRef<"InventoryAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryAlert findUnique
   */
  export type InventoryAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * Filter, which InventoryAlert to fetch.
     */
    where: InventoryAlertWhereUniqueInput
  }

  /**
   * InventoryAlert findUniqueOrThrow
   */
  export type InventoryAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * Filter, which InventoryAlert to fetch.
     */
    where: InventoryAlertWhereUniqueInput
  }

  /**
   * InventoryAlert findFirst
   */
  export type InventoryAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * Filter, which InventoryAlert to fetch.
     */
    where?: InventoryAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryAlerts to fetch.
     */
    orderBy?: InventoryAlertOrderByWithRelationInput | InventoryAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryAlerts.
     */
    cursor?: InventoryAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryAlerts.
     */
    distinct?: InventoryAlertScalarFieldEnum | InventoryAlertScalarFieldEnum[]
  }

  /**
   * InventoryAlert findFirstOrThrow
   */
  export type InventoryAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * Filter, which InventoryAlert to fetch.
     */
    where?: InventoryAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryAlerts to fetch.
     */
    orderBy?: InventoryAlertOrderByWithRelationInput | InventoryAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryAlerts.
     */
    cursor?: InventoryAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryAlerts.
     */
    distinct?: InventoryAlertScalarFieldEnum | InventoryAlertScalarFieldEnum[]
  }

  /**
   * InventoryAlert findMany
   */
  export type InventoryAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * Filter, which InventoryAlerts to fetch.
     */
    where?: InventoryAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryAlerts to fetch.
     */
    orderBy?: InventoryAlertOrderByWithRelationInput | InventoryAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryAlerts.
     */
    cursor?: InventoryAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryAlerts.
     */
    distinct?: InventoryAlertScalarFieldEnum | InventoryAlertScalarFieldEnum[]
  }

  /**
   * InventoryAlert create
   */
  export type InventoryAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * The data needed to create a InventoryAlert.
     */
    data: XOR<InventoryAlertCreateInput, InventoryAlertUncheckedCreateInput>
  }

  /**
   * InventoryAlert createMany
   */
  export type InventoryAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryAlerts.
     */
    data: InventoryAlertCreateManyInput | InventoryAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryAlert createManyAndReturn
   */
  export type InventoryAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * The data used to create many InventoryAlerts.
     */
    data: InventoryAlertCreateManyInput | InventoryAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryAlert update
   */
  export type InventoryAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * The data needed to update a InventoryAlert.
     */
    data: XOR<InventoryAlertUpdateInput, InventoryAlertUncheckedUpdateInput>
    /**
     * Choose, which InventoryAlert to update.
     */
    where: InventoryAlertWhereUniqueInput
  }

  /**
   * InventoryAlert updateMany
   */
  export type InventoryAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryAlerts.
     */
    data: XOR<InventoryAlertUpdateManyMutationInput, InventoryAlertUncheckedUpdateManyInput>
    /**
     * Filter which InventoryAlerts to update
     */
    where?: InventoryAlertWhereInput
    /**
     * Limit how many InventoryAlerts to update.
     */
    limit?: number
  }

  /**
   * InventoryAlert updateManyAndReturn
   */
  export type InventoryAlertUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * The data used to update InventoryAlerts.
     */
    data: XOR<InventoryAlertUpdateManyMutationInput, InventoryAlertUncheckedUpdateManyInput>
    /**
     * Filter which InventoryAlerts to update
     */
    where?: InventoryAlertWhereInput
    /**
     * Limit how many InventoryAlerts to update.
     */
    limit?: number
  }

  /**
   * InventoryAlert upsert
   */
  export type InventoryAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * The filter to search for the InventoryAlert to update in case it exists.
     */
    where: InventoryAlertWhereUniqueInput
    /**
     * In case the InventoryAlert found by the `where` argument doesn't exist, create a new InventoryAlert with this data.
     */
    create: XOR<InventoryAlertCreateInput, InventoryAlertUncheckedCreateInput>
    /**
     * In case the InventoryAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryAlertUpdateInput, InventoryAlertUncheckedUpdateInput>
  }

  /**
   * InventoryAlert delete
   */
  export type InventoryAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
    /**
     * Filter which InventoryAlert to delete.
     */
    where: InventoryAlertWhereUniqueInput
  }

  /**
   * InventoryAlert deleteMany
   */
  export type InventoryAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryAlerts to delete
     */
    where?: InventoryAlertWhereInput
    /**
     * Limit how many InventoryAlerts to delete.
     */
    limit?: number
  }

  /**
   * InventoryAlert without action
   */
  export type InventoryAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAlert
     */
    select?: InventoryAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryAlert
     */
    omit?: InventoryAlertOmit<ExtArgs> | null
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


  export const InventoryScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    vendorId: 'vendorId',
    totalStock: 'totalStock',
    reservedStock: 'reservedStock',
    availableStock: 'availableStock',
    lowStockThreshold: 'lowStockThreshold',
    isLowStock: 'isLowStock',
    isOutOfStock: 'isOutOfStock',
    lastRestockAt: 'lastRestockAt',
    lastSoldAt: 'lastSoldAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventoryScalarFieldEnum = (typeof InventoryScalarFieldEnum)[keyof typeof InventoryScalarFieldEnum]


  export const StockReservationScalarFieldEnum: {
    id: 'id',
    inventoryId: 'inventoryId',
    orderId: 'orderId',
    quantity: 'quantity',
    status: 'status',
    expiresAt: 'expiresAt',
    releasedAt: 'releasedAt',
    fulfilledAt: 'fulfilledAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StockReservationScalarFieldEnum = (typeof StockReservationScalarFieldEnum)[keyof typeof StockReservationScalarFieldEnum]


  export const StockMovementScalarFieldEnum: {
    id: 'id',
    inventoryId: 'inventoryId',
    type: 'type',
    quantity: 'quantity',
    reason: 'reason',
    reference: 'reference',
    previousStock: 'previousStock',
    newStock: 'newStock',
    performedBy: 'performedBy',
    createdAt: 'createdAt'
  };

  export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum]


  export const InventoryAlertScalarFieldEnum: {
    id: 'id',
    inventoryId: 'inventoryId',
    productId: 'productId',
    vendorId: 'vendorId',
    type: 'type',
    message: 'message',
    isRead: 'isRead',
    createdAt: 'createdAt'
  };

  export type InventoryAlertScalarFieldEnum = (typeof InventoryAlertScalarFieldEnum)[keyof typeof InventoryAlertScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ReservationStatus'
   */
  export type EnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus'>
    


  /**
   * Reference to a field of type 'ReservationStatus[]'
   */
  export type ListEnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus[]'>
    


  /**
   * Reference to a field of type 'MovementType'
   */
  export type EnumMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MovementType'>
    


  /**
   * Reference to a field of type 'MovementType[]'
   */
  export type ListEnumMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MovementType[]'>
    


  /**
   * Reference to a field of type 'AlertType'
   */
  export type EnumAlertTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertType'>
    


  /**
   * Reference to a field of type 'AlertType[]'
   */
  export type ListEnumAlertTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type InventoryWhereInput = {
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    id?: StringFilter<"Inventory"> | string
    productId?: StringFilter<"Inventory"> | string
    vendorId?: StringFilter<"Inventory"> | string
    totalStock?: IntFilter<"Inventory"> | number
    reservedStock?: IntFilter<"Inventory"> | number
    availableStock?: IntFilter<"Inventory"> | number
    lowStockThreshold?: IntFilter<"Inventory"> | number
    isLowStock?: BoolFilter<"Inventory"> | boolean
    isOutOfStock?: BoolFilter<"Inventory"> | boolean
    lastRestockAt?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    lastSoldAt?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    reservations?: StockReservationListRelationFilter
    movements?: StockMovementListRelationFilter
  }

  export type InventoryOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
    isLowStock?: SortOrder
    isOutOfStock?: SortOrder
    lastRestockAt?: SortOrderInput | SortOrder
    lastSoldAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reservations?: StockReservationOrderByRelationAggregateInput
    movements?: StockMovementOrderByRelationAggregateInput
  }

  export type InventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId?: string
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    vendorId?: StringFilter<"Inventory"> | string
    totalStock?: IntFilter<"Inventory"> | number
    reservedStock?: IntFilter<"Inventory"> | number
    availableStock?: IntFilter<"Inventory"> | number
    lowStockThreshold?: IntFilter<"Inventory"> | number
    isLowStock?: BoolFilter<"Inventory"> | boolean
    isOutOfStock?: BoolFilter<"Inventory"> | boolean
    lastRestockAt?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    lastSoldAt?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    reservations?: StockReservationListRelationFilter
    movements?: StockMovementListRelationFilter
  }, "id" | "productId">

  export type InventoryOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
    isLowStock?: SortOrder
    isOutOfStock?: SortOrder
    lastRestockAt?: SortOrderInput | SortOrder
    lastSoldAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryCountOrderByAggregateInput
    _avg?: InventoryAvgOrderByAggregateInput
    _max?: InventoryMaxOrderByAggregateInput
    _min?: InventoryMinOrderByAggregateInput
    _sum?: InventorySumOrderByAggregateInput
  }

  export type InventoryScalarWhereWithAggregatesInput = {
    AND?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    OR?: InventoryScalarWhereWithAggregatesInput[]
    NOT?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inventory"> | string
    productId?: StringWithAggregatesFilter<"Inventory"> | string
    vendorId?: StringWithAggregatesFilter<"Inventory"> | string
    totalStock?: IntWithAggregatesFilter<"Inventory"> | number
    reservedStock?: IntWithAggregatesFilter<"Inventory"> | number
    availableStock?: IntWithAggregatesFilter<"Inventory"> | number
    lowStockThreshold?: IntWithAggregatesFilter<"Inventory"> | number
    isLowStock?: BoolWithAggregatesFilter<"Inventory"> | boolean
    isOutOfStock?: BoolWithAggregatesFilter<"Inventory"> | boolean
    lastRestockAt?: DateTimeNullableWithAggregatesFilter<"Inventory"> | Date | string | null
    lastSoldAt?: DateTimeNullableWithAggregatesFilter<"Inventory"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
  }

  export type StockReservationWhereInput = {
    AND?: StockReservationWhereInput | StockReservationWhereInput[]
    OR?: StockReservationWhereInput[]
    NOT?: StockReservationWhereInput | StockReservationWhereInput[]
    id?: StringFilter<"StockReservation"> | string
    inventoryId?: StringFilter<"StockReservation"> | string
    orderId?: StringFilter<"StockReservation"> | string
    quantity?: IntFilter<"StockReservation"> | number
    status?: EnumReservationStatusFilter<"StockReservation"> | $Enums.ReservationStatus
    expiresAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    releasedAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    fulfilledAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    createdAt?: DateTimeFilter<"StockReservation"> | Date | string
    updatedAt?: DateTimeFilter<"StockReservation"> | Date | string
    inventory?: XOR<InventoryScalarRelationFilter, InventoryWhereInput>
  }

  export type StockReservationOrderByWithRelationInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    orderId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    releasedAt?: SortOrderInput | SortOrder
    fulfilledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inventory?: InventoryOrderByWithRelationInput
  }

  export type StockReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    inventoryId_orderId?: StockReservationInventoryIdOrderIdCompoundUniqueInput
    AND?: StockReservationWhereInput | StockReservationWhereInput[]
    OR?: StockReservationWhereInput[]
    NOT?: StockReservationWhereInput | StockReservationWhereInput[]
    inventoryId?: StringFilter<"StockReservation"> | string
    orderId?: StringFilter<"StockReservation"> | string
    quantity?: IntFilter<"StockReservation"> | number
    status?: EnumReservationStatusFilter<"StockReservation"> | $Enums.ReservationStatus
    expiresAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    releasedAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    fulfilledAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    createdAt?: DateTimeFilter<"StockReservation"> | Date | string
    updatedAt?: DateTimeFilter<"StockReservation"> | Date | string
    inventory?: XOR<InventoryScalarRelationFilter, InventoryWhereInput>
  }, "id" | "inventoryId_orderId">

  export type StockReservationOrderByWithAggregationInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    orderId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    releasedAt?: SortOrderInput | SortOrder
    fulfilledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StockReservationCountOrderByAggregateInput
    _avg?: StockReservationAvgOrderByAggregateInput
    _max?: StockReservationMaxOrderByAggregateInput
    _min?: StockReservationMinOrderByAggregateInput
    _sum?: StockReservationSumOrderByAggregateInput
  }

  export type StockReservationScalarWhereWithAggregatesInput = {
    AND?: StockReservationScalarWhereWithAggregatesInput | StockReservationScalarWhereWithAggregatesInput[]
    OR?: StockReservationScalarWhereWithAggregatesInput[]
    NOT?: StockReservationScalarWhereWithAggregatesInput | StockReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockReservation"> | string
    inventoryId?: StringWithAggregatesFilter<"StockReservation"> | string
    orderId?: StringWithAggregatesFilter<"StockReservation"> | string
    quantity?: IntWithAggregatesFilter<"StockReservation"> | number
    status?: EnumReservationStatusWithAggregatesFilter<"StockReservation"> | $Enums.ReservationStatus
    expiresAt?: DateTimeNullableWithAggregatesFilter<"StockReservation"> | Date | string | null
    releasedAt?: DateTimeNullableWithAggregatesFilter<"StockReservation"> | Date | string | null
    fulfilledAt?: DateTimeNullableWithAggregatesFilter<"StockReservation"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StockReservation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StockReservation"> | Date | string
  }

  export type StockMovementWhereInput = {
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    id?: StringFilter<"StockMovement"> | string
    inventoryId?: StringFilter<"StockMovement"> | string
    type?: EnumMovementTypeFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntFilter<"StockMovement"> | number
    reason?: StringNullableFilter<"StockMovement"> | string | null
    reference?: StringNullableFilter<"StockMovement"> | string | null
    previousStock?: IntFilter<"StockMovement"> | number
    newStock?: IntFilter<"StockMovement"> | number
    performedBy?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    inventory?: XOR<InventoryScalarRelationFilter, InventoryWhereInput>
  }

  export type StockMovementOrderByWithRelationInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    reason?: SortOrderInput | SortOrder
    reference?: SortOrderInput | SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    inventory?: InventoryOrderByWithRelationInput
  }

  export type StockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    inventoryId?: StringFilter<"StockMovement"> | string
    type?: EnumMovementTypeFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntFilter<"StockMovement"> | number
    reason?: StringNullableFilter<"StockMovement"> | string | null
    reference?: StringNullableFilter<"StockMovement"> | string | null
    previousStock?: IntFilter<"StockMovement"> | number
    newStock?: IntFilter<"StockMovement"> | number
    performedBy?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    inventory?: XOR<InventoryScalarRelationFilter, InventoryWhereInput>
  }, "id">

  export type StockMovementOrderByWithAggregationInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    reason?: SortOrderInput | SortOrder
    reference?: SortOrderInput | SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StockMovementCountOrderByAggregateInput
    _avg?: StockMovementAvgOrderByAggregateInput
    _max?: StockMovementMaxOrderByAggregateInput
    _min?: StockMovementMinOrderByAggregateInput
    _sum?: StockMovementSumOrderByAggregateInput
  }

  export type StockMovementScalarWhereWithAggregatesInput = {
    AND?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    OR?: StockMovementScalarWhereWithAggregatesInput[]
    NOT?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockMovement"> | string
    inventoryId?: StringWithAggregatesFilter<"StockMovement"> | string
    type?: EnumMovementTypeWithAggregatesFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntWithAggregatesFilter<"StockMovement"> | number
    reason?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
    reference?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
    previousStock?: IntWithAggregatesFilter<"StockMovement"> | number
    newStock?: IntWithAggregatesFilter<"StockMovement"> | number
    performedBy?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StockMovement"> | Date | string
  }

  export type InventoryAlertWhereInput = {
    AND?: InventoryAlertWhereInput | InventoryAlertWhereInput[]
    OR?: InventoryAlertWhereInput[]
    NOT?: InventoryAlertWhereInput | InventoryAlertWhereInput[]
    id?: StringFilter<"InventoryAlert"> | string
    inventoryId?: StringFilter<"InventoryAlert"> | string
    productId?: StringFilter<"InventoryAlert"> | string
    vendorId?: StringFilter<"InventoryAlert"> | string
    type?: EnumAlertTypeFilter<"InventoryAlert"> | $Enums.AlertType
    message?: StringFilter<"InventoryAlert"> | string
    isRead?: BoolFilter<"InventoryAlert"> | boolean
    createdAt?: DateTimeFilter<"InventoryAlert"> | Date | string
  }

  export type InventoryAlertOrderByWithRelationInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryAlertWhereInput | InventoryAlertWhereInput[]
    OR?: InventoryAlertWhereInput[]
    NOT?: InventoryAlertWhereInput | InventoryAlertWhereInput[]
    inventoryId?: StringFilter<"InventoryAlert"> | string
    productId?: StringFilter<"InventoryAlert"> | string
    vendorId?: StringFilter<"InventoryAlert"> | string
    type?: EnumAlertTypeFilter<"InventoryAlert"> | $Enums.AlertType
    message?: StringFilter<"InventoryAlert"> | string
    isRead?: BoolFilter<"InventoryAlert"> | boolean
    createdAt?: DateTimeFilter<"InventoryAlert"> | Date | string
  }, "id">

  export type InventoryAlertOrderByWithAggregationInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: InventoryAlertCountOrderByAggregateInput
    _max?: InventoryAlertMaxOrderByAggregateInput
    _min?: InventoryAlertMinOrderByAggregateInput
  }

  export type InventoryAlertScalarWhereWithAggregatesInput = {
    AND?: InventoryAlertScalarWhereWithAggregatesInput | InventoryAlertScalarWhereWithAggregatesInput[]
    OR?: InventoryAlertScalarWhereWithAggregatesInput[]
    NOT?: InventoryAlertScalarWhereWithAggregatesInput | InventoryAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryAlert"> | string
    inventoryId?: StringWithAggregatesFilter<"InventoryAlert"> | string
    productId?: StringWithAggregatesFilter<"InventoryAlert"> | string
    vendorId?: StringWithAggregatesFilter<"InventoryAlert"> | string
    type?: EnumAlertTypeWithAggregatesFilter<"InventoryAlert"> | $Enums.AlertType
    message?: StringWithAggregatesFilter<"InventoryAlert"> | string
    isRead?: BoolWithAggregatesFilter<"InventoryAlert"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"InventoryAlert"> | Date | string
  }

  export type InventoryCreateInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: StockReservationCreateNestedManyWithoutInventoryInput
    movements?: StockMovementCreateNestedManyWithoutInventoryInput
  }

  export type InventoryUncheckedCreateInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: StockReservationUncheckedCreateNestedManyWithoutInventoryInput
    movements?: StockMovementUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type InventoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: StockReservationUpdateManyWithoutInventoryNestedInput
    movements?: StockMovementUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: StockReservationUncheckedUpdateManyWithoutInventoryNestedInput
    movements?: StockMovementUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryCreateManyInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockReservationCreateInput = {
    id?: string
    orderId: string
    quantity: number
    status?: $Enums.ReservationStatus
    expiresAt?: Date | string | null
    releasedAt?: Date | string | null
    fulfilledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventory: InventoryCreateNestedOneWithoutReservationsInput
  }

  export type StockReservationUncheckedCreateInput = {
    id?: string
    inventoryId: string
    orderId: string
    quantity: number
    status?: $Enums.ReservationStatus
    expiresAt?: Date | string | null
    releasedAt?: Date | string | null
    fulfilledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory?: InventoryUpdateOneRequiredWithoutReservationsNestedInput
  }

  export type StockReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockReservationCreateManyInput = {
    id?: string
    inventoryId: string
    orderId: string
    quantity: number
    status?: $Enums.ReservationStatus
    expiresAt?: Date | string | null
    releasedAt?: Date | string | null
    fulfilledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateInput = {
    id?: string
    type: $Enums.MovementType
    quantity: number
    reason?: string | null
    reference?: string | null
    previousStock: number
    newStock: number
    performedBy?: string | null
    createdAt?: Date | string
    inventory: InventoryCreateNestedOneWithoutMovementsInput
  }

  export type StockMovementUncheckedCreateInput = {
    id?: string
    inventoryId: string
    type: $Enums.MovementType
    quantity: number
    reason?: string | null
    reference?: string | null
    previousStock: number
    newStock: number
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory?: InventoryUpdateOneRequiredWithoutMovementsNestedInput
  }

  export type StockMovementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateManyInput = {
    id?: string
    inventoryId: string
    type: $Enums.MovementType
    quantity: number
    reason?: string | null
    reference?: string | null
    previousStock: number
    newStock: number
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryAlertCreateInput = {
    id?: string
    inventoryId: string
    productId: string
    vendorId: string
    type: $Enums.AlertType
    message: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type InventoryAlertUncheckedCreateInput = {
    id?: string
    inventoryId: string
    productId: string
    vendorId: string
    type: $Enums.AlertType
    message: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type InventoryAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    type?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    type?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryAlertCreateManyInput = {
    id?: string
    inventoryId: string
    productId: string
    vendorId: string
    type: $Enums.AlertType
    message: string
    isRead?: boolean
    createdAt?: Date | string
  }

  export type InventoryAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    type?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    type?: EnumAlertTypeFieldUpdateOperationsInput | $Enums.AlertType
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type StockReservationListRelationFilter = {
    every?: StockReservationWhereInput
    some?: StockReservationWhereInput
    none?: StockReservationWhereInput
  }

  export type StockMovementListRelationFilter = {
    every?: StockMovementWhereInput
    some?: StockMovementWhereInput
    none?: StockMovementWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StockReservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StockMovementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
    isLowStock?: SortOrder
    isOutOfStock?: SortOrder
    lastRestockAt?: SortOrder
    lastSoldAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryAvgOrderByAggregateInput = {
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
  }

  export type InventoryMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
    isLowStock?: SortOrder
    isOutOfStock?: SortOrder
    lastRestockAt?: SortOrder
    lastSoldAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
    isLowStock?: SortOrder
    isOutOfStock?: SortOrder
    lastRestockAt?: SortOrder
    lastSoldAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventorySumOrderByAggregateInput = {
    totalStock?: SortOrder
    reservedStock?: SortOrder
    availableStock?: SortOrder
    lowStockThreshold?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type EnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
  }

  export type InventoryScalarRelationFilter = {
    is?: InventoryWhereInput
    isNot?: InventoryWhereInput
  }

  export type StockReservationInventoryIdOrderIdCompoundUniqueInput = {
    inventoryId: string
    orderId: string
  }

  export type StockReservationCountOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    orderId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    releasedAt?: SortOrder
    fulfilledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StockReservationAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type StockReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    orderId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    releasedAt?: SortOrder
    fulfilledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StockReservationMinOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    orderId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    releasedAt?: SortOrder
    fulfilledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StockReservationSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
  }

  export type EnumMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMovementTypeFilter<$PrismaModel> | $Enums.MovementType
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

  export type StockMovementCountOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    reference?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    performedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementAvgOrderByAggregateInput = {
    quantity?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
  }

  export type StockMovementMaxOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    reference?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    performedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementMinOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    reference?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
    performedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementSumOrderByAggregateInput = {
    quantity?: SortOrder
    previousStock?: SortOrder
    newStock?: SortOrder
  }

  export type EnumMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.MovementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMovementTypeFilter<$PrismaModel>
    _max?: NestedEnumMovementTypeFilter<$PrismaModel>
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

  export type EnumAlertTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeFilter<$PrismaModel> | $Enums.AlertType
  }

  export type InventoryAlertCountOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryAlertMinOrderByAggregateInput = {
    id?: SortOrder
    inventoryId?: SortOrder
    productId?: SortOrder
    vendorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAlertTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeWithAggregatesFilter<$PrismaModel> | $Enums.AlertType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertTypeFilter<$PrismaModel>
    _max?: NestedEnumAlertTypeFilter<$PrismaModel>
  }

  export type StockReservationCreateNestedManyWithoutInventoryInput = {
    create?: XOR<StockReservationCreateWithoutInventoryInput, StockReservationUncheckedCreateWithoutInventoryInput> | StockReservationCreateWithoutInventoryInput[] | StockReservationUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockReservationCreateOrConnectWithoutInventoryInput | StockReservationCreateOrConnectWithoutInventoryInput[]
    createMany?: StockReservationCreateManyInventoryInputEnvelope
    connect?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
  }

  export type StockMovementCreateNestedManyWithoutInventoryInput = {
    create?: XOR<StockMovementCreateWithoutInventoryInput, StockMovementUncheckedCreateWithoutInventoryInput> | StockMovementCreateWithoutInventoryInput[] | StockMovementUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutInventoryInput | StockMovementCreateOrConnectWithoutInventoryInput[]
    createMany?: StockMovementCreateManyInventoryInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type StockReservationUncheckedCreateNestedManyWithoutInventoryInput = {
    create?: XOR<StockReservationCreateWithoutInventoryInput, StockReservationUncheckedCreateWithoutInventoryInput> | StockReservationCreateWithoutInventoryInput[] | StockReservationUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockReservationCreateOrConnectWithoutInventoryInput | StockReservationCreateOrConnectWithoutInventoryInput[]
    createMany?: StockReservationCreateManyInventoryInputEnvelope
    connect?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
  }

  export type StockMovementUncheckedCreateNestedManyWithoutInventoryInput = {
    create?: XOR<StockMovementCreateWithoutInventoryInput, StockMovementUncheckedCreateWithoutInventoryInput> | StockMovementCreateWithoutInventoryInput[] | StockMovementUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutInventoryInput | StockMovementCreateOrConnectWithoutInventoryInput[]
    createMany?: StockMovementCreateManyInventoryInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StockReservationUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<StockReservationCreateWithoutInventoryInput, StockReservationUncheckedCreateWithoutInventoryInput> | StockReservationCreateWithoutInventoryInput[] | StockReservationUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockReservationCreateOrConnectWithoutInventoryInput | StockReservationCreateOrConnectWithoutInventoryInput[]
    upsert?: StockReservationUpsertWithWhereUniqueWithoutInventoryInput | StockReservationUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: StockReservationCreateManyInventoryInputEnvelope
    set?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    disconnect?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    delete?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    connect?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    update?: StockReservationUpdateWithWhereUniqueWithoutInventoryInput | StockReservationUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: StockReservationUpdateManyWithWhereWithoutInventoryInput | StockReservationUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: StockReservationScalarWhereInput | StockReservationScalarWhereInput[]
  }

  export type StockMovementUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<StockMovementCreateWithoutInventoryInput, StockMovementUncheckedCreateWithoutInventoryInput> | StockMovementCreateWithoutInventoryInput[] | StockMovementUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutInventoryInput | StockMovementCreateOrConnectWithoutInventoryInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutInventoryInput | StockMovementUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: StockMovementCreateManyInventoryInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutInventoryInput | StockMovementUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutInventoryInput | StockMovementUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type StockReservationUncheckedUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<StockReservationCreateWithoutInventoryInput, StockReservationUncheckedCreateWithoutInventoryInput> | StockReservationCreateWithoutInventoryInput[] | StockReservationUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockReservationCreateOrConnectWithoutInventoryInput | StockReservationCreateOrConnectWithoutInventoryInput[]
    upsert?: StockReservationUpsertWithWhereUniqueWithoutInventoryInput | StockReservationUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: StockReservationCreateManyInventoryInputEnvelope
    set?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    disconnect?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    delete?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    connect?: StockReservationWhereUniqueInput | StockReservationWhereUniqueInput[]
    update?: StockReservationUpdateWithWhereUniqueWithoutInventoryInput | StockReservationUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: StockReservationUpdateManyWithWhereWithoutInventoryInput | StockReservationUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: StockReservationScalarWhereInput | StockReservationScalarWhereInput[]
  }

  export type StockMovementUncheckedUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<StockMovementCreateWithoutInventoryInput, StockMovementUncheckedCreateWithoutInventoryInput> | StockMovementCreateWithoutInventoryInput[] | StockMovementUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutInventoryInput | StockMovementCreateOrConnectWithoutInventoryInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutInventoryInput | StockMovementUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: StockMovementCreateManyInventoryInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutInventoryInput | StockMovementUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutInventoryInput | StockMovementUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type InventoryCreateNestedOneWithoutReservationsInput = {
    create?: XOR<InventoryCreateWithoutReservationsInput, InventoryUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: InventoryCreateOrConnectWithoutReservationsInput
    connect?: InventoryWhereUniqueInput
  }

  export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus
  }

  export type InventoryUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<InventoryCreateWithoutReservationsInput, InventoryUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: InventoryCreateOrConnectWithoutReservationsInput
    upsert?: InventoryUpsertWithoutReservationsInput
    connect?: InventoryWhereUniqueInput
    update?: XOR<XOR<InventoryUpdateToOneWithWhereWithoutReservationsInput, InventoryUpdateWithoutReservationsInput>, InventoryUncheckedUpdateWithoutReservationsInput>
  }

  export type InventoryCreateNestedOneWithoutMovementsInput = {
    create?: XOR<InventoryCreateWithoutMovementsInput, InventoryUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: InventoryCreateOrConnectWithoutMovementsInput
    connect?: InventoryWhereUniqueInput
  }

  export type EnumMovementTypeFieldUpdateOperationsInput = {
    set?: $Enums.MovementType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type InventoryUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: XOR<InventoryCreateWithoutMovementsInput, InventoryUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: InventoryCreateOrConnectWithoutMovementsInput
    upsert?: InventoryUpsertWithoutMovementsInput
    connect?: InventoryWhereUniqueInput
    update?: XOR<XOR<InventoryUpdateToOneWithWhereWithoutMovementsInput, InventoryUpdateWithoutMovementsInput>, InventoryUncheckedUpdateWithoutMovementsInput>
  }

  export type EnumAlertTypeFieldUpdateOperationsInput = {
    set?: $Enums.AlertType
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
  }

  export type NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
  }

  export type NestedEnumMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMovementTypeFilter<$PrismaModel> | $Enums.MovementType
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

  export type NestedEnumMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MovementType[] | ListEnumMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.MovementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMovementTypeFilter<$PrismaModel>
    _max?: NestedEnumMovementTypeFilter<$PrismaModel>
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

  export type NestedEnumAlertTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeFilter<$PrismaModel> | $Enums.AlertType
  }

  export type NestedEnumAlertTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertType | EnumAlertTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertType[] | ListEnumAlertTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertTypeWithAggregatesFilter<$PrismaModel> | $Enums.AlertType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertTypeFilter<$PrismaModel>
    _max?: NestedEnumAlertTypeFilter<$PrismaModel>
  }

  export type StockReservationCreateWithoutInventoryInput = {
    id?: string
    orderId: string
    quantity: number
    status?: $Enums.ReservationStatus
    expiresAt?: Date | string | null
    releasedAt?: Date | string | null
    fulfilledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockReservationUncheckedCreateWithoutInventoryInput = {
    id?: string
    orderId: string
    quantity: number
    status?: $Enums.ReservationStatus
    expiresAt?: Date | string | null
    releasedAt?: Date | string | null
    fulfilledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockReservationCreateOrConnectWithoutInventoryInput = {
    where: StockReservationWhereUniqueInput
    create: XOR<StockReservationCreateWithoutInventoryInput, StockReservationUncheckedCreateWithoutInventoryInput>
  }

  export type StockReservationCreateManyInventoryInputEnvelope = {
    data: StockReservationCreateManyInventoryInput | StockReservationCreateManyInventoryInput[]
    skipDuplicates?: boolean
  }

  export type StockMovementCreateWithoutInventoryInput = {
    id?: string
    type: $Enums.MovementType
    quantity: number
    reason?: string | null
    reference?: string | null
    previousStock: number
    newStock: number
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUncheckedCreateWithoutInventoryInput = {
    id?: string
    type: $Enums.MovementType
    quantity: number
    reason?: string | null
    reference?: string | null
    previousStock: number
    newStock: number
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type StockMovementCreateOrConnectWithoutInventoryInput = {
    where: StockMovementWhereUniqueInput
    create: XOR<StockMovementCreateWithoutInventoryInput, StockMovementUncheckedCreateWithoutInventoryInput>
  }

  export type StockMovementCreateManyInventoryInputEnvelope = {
    data: StockMovementCreateManyInventoryInput | StockMovementCreateManyInventoryInput[]
    skipDuplicates?: boolean
  }

  export type StockReservationUpsertWithWhereUniqueWithoutInventoryInput = {
    where: StockReservationWhereUniqueInput
    update: XOR<StockReservationUpdateWithoutInventoryInput, StockReservationUncheckedUpdateWithoutInventoryInput>
    create: XOR<StockReservationCreateWithoutInventoryInput, StockReservationUncheckedCreateWithoutInventoryInput>
  }

  export type StockReservationUpdateWithWhereUniqueWithoutInventoryInput = {
    where: StockReservationWhereUniqueInput
    data: XOR<StockReservationUpdateWithoutInventoryInput, StockReservationUncheckedUpdateWithoutInventoryInput>
  }

  export type StockReservationUpdateManyWithWhereWithoutInventoryInput = {
    where: StockReservationScalarWhereInput
    data: XOR<StockReservationUpdateManyMutationInput, StockReservationUncheckedUpdateManyWithoutInventoryInput>
  }

  export type StockReservationScalarWhereInput = {
    AND?: StockReservationScalarWhereInput | StockReservationScalarWhereInput[]
    OR?: StockReservationScalarWhereInput[]
    NOT?: StockReservationScalarWhereInput | StockReservationScalarWhereInput[]
    id?: StringFilter<"StockReservation"> | string
    inventoryId?: StringFilter<"StockReservation"> | string
    orderId?: StringFilter<"StockReservation"> | string
    quantity?: IntFilter<"StockReservation"> | number
    status?: EnumReservationStatusFilter<"StockReservation"> | $Enums.ReservationStatus
    expiresAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    releasedAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    fulfilledAt?: DateTimeNullableFilter<"StockReservation"> | Date | string | null
    createdAt?: DateTimeFilter<"StockReservation"> | Date | string
    updatedAt?: DateTimeFilter<"StockReservation"> | Date | string
  }

  export type StockMovementUpsertWithWhereUniqueWithoutInventoryInput = {
    where: StockMovementWhereUniqueInput
    update: XOR<StockMovementUpdateWithoutInventoryInput, StockMovementUncheckedUpdateWithoutInventoryInput>
    create: XOR<StockMovementCreateWithoutInventoryInput, StockMovementUncheckedCreateWithoutInventoryInput>
  }

  export type StockMovementUpdateWithWhereUniqueWithoutInventoryInput = {
    where: StockMovementWhereUniqueInput
    data: XOR<StockMovementUpdateWithoutInventoryInput, StockMovementUncheckedUpdateWithoutInventoryInput>
  }

  export type StockMovementUpdateManyWithWhereWithoutInventoryInput = {
    where: StockMovementScalarWhereInput
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyWithoutInventoryInput>
  }

  export type StockMovementScalarWhereInput = {
    AND?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    OR?: StockMovementScalarWhereInput[]
    NOT?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    id?: StringFilter<"StockMovement"> | string
    inventoryId?: StringFilter<"StockMovement"> | string
    type?: EnumMovementTypeFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntFilter<"StockMovement"> | number
    reason?: StringNullableFilter<"StockMovement"> | string | null
    reference?: StringNullableFilter<"StockMovement"> | string | null
    previousStock?: IntFilter<"StockMovement"> | number
    newStock?: IntFilter<"StockMovement"> | number
    performedBy?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
  }

  export type InventoryCreateWithoutReservationsInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: StockMovementCreateNestedManyWithoutInventoryInput
  }

  export type InventoryUncheckedCreateWithoutReservationsInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: StockMovementUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type InventoryCreateOrConnectWithoutReservationsInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutReservationsInput, InventoryUncheckedCreateWithoutReservationsInput>
  }

  export type InventoryUpsertWithoutReservationsInput = {
    update: XOR<InventoryUpdateWithoutReservationsInput, InventoryUncheckedUpdateWithoutReservationsInput>
    create: XOR<InventoryCreateWithoutReservationsInput, InventoryUncheckedCreateWithoutReservationsInput>
    where?: InventoryWhereInput
  }

  export type InventoryUpdateToOneWithWhereWithoutReservationsInput = {
    where?: InventoryWhereInput
    data: XOR<InventoryUpdateWithoutReservationsInput, InventoryUncheckedUpdateWithoutReservationsInput>
  }

  export type InventoryUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: StockMovementUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: StockMovementUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryCreateWithoutMovementsInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: StockReservationCreateNestedManyWithoutInventoryInput
  }

  export type InventoryUncheckedCreateWithoutMovementsInput = {
    id?: string
    productId: string
    vendorId: string
    totalStock?: number
    reservedStock?: number
    availableStock?: number
    lowStockThreshold?: number
    isLowStock?: boolean
    isOutOfStock?: boolean
    lastRestockAt?: Date | string | null
    lastSoldAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: StockReservationUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type InventoryCreateOrConnectWithoutMovementsInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutMovementsInput, InventoryUncheckedCreateWithoutMovementsInput>
  }

  export type InventoryUpsertWithoutMovementsInput = {
    update: XOR<InventoryUpdateWithoutMovementsInput, InventoryUncheckedUpdateWithoutMovementsInput>
    create: XOR<InventoryCreateWithoutMovementsInput, InventoryUncheckedCreateWithoutMovementsInput>
    where?: InventoryWhereInput
  }

  export type InventoryUpdateToOneWithWhereWithoutMovementsInput = {
    where?: InventoryWhereInput
    data: XOR<InventoryUpdateWithoutMovementsInput, InventoryUncheckedUpdateWithoutMovementsInput>
  }

  export type InventoryUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: StockReservationUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    totalStock?: IntFieldUpdateOperationsInput | number
    reservedStock?: IntFieldUpdateOperationsInput | number
    availableStock?: IntFieldUpdateOperationsInput | number
    lowStockThreshold?: IntFieldUpdateOperationsInput | number
    isLowStock?: BoolFieldUpdateOperationsInput | boolean
    isOutOfStock?: BoolFieldUpdateOperationsInput | boolean
    lastRestockAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSoldAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: StockReservationUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type StockReservationCreateManyInventoryInput = {
    id?: string
    orderId: string
    quantity: number
    status?: $Enums.ReservationStatus
    expiresAt?: Date | string | null
    releasedAt?: Date | string | null
    fulfilledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockMovementCreateManyInventoryInput = {
    id?: string
    type: $Enums.MovementType
    quantity: number
    reason?: string | null
    reference?: string | null
    previousStock: number
    newStock: number
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type StockReservationUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockReservationUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockReservationUncheckedUpdateManyWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releasedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    previousStock?: IntFieldUpdateOperationsInput | number
    newStock?: IntFieldUpdateOperationsInput | number
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
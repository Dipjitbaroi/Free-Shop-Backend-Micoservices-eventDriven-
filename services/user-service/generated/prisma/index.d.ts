
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
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model Address
 * 
 */
export type Address = $Result.DefaultSelection<Prisma.$AddressPayload>
/**
 * Model WishlistItem
 * 
 */
export type WishlistItem = $Result.DefaultSelection<Prisma.$WishlistItemPayload>
/**
 * Model RecentlyViewed
 * 
 */
export type RecentlyViewed = $Result.DefaultSelection<Prisma.$RecentlyViewedPayload>
/**
 * Model SellerProfile
 * 
 */
export type SellerProfile = $Result.DefaultSelection<Prisma.$SellerProfilePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Gender: {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};

export type Gender = (typeof Gender)[keyof typeof Gender]


export const AddressType: {
  SHIPPING: 'SHIPPING',
  BILLING: 'BILLING',
  BOTH: 'BOTH'
};

export type AddressType = (typeof AddressType)[keyof typeof AddressType]


export const SellerStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  ONBOARDING: 'ONBOARDING'
};

export type SellerStatus = (typeof SellerStatus)[keyof typeof SellerStatus]

}

export type Gender = $Enums.Gender

export const Gender: typeof $Enums.Gender

export type AddressType = $Enums.AddressType

export const AddressType: typeof $Enums.AddressType

export type SellerStatus = $Enums.SellerStatus

export const SellerStatus: typeof $Enums.SellerStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more UserProfiles
 * const userProfiles = await prisma.userProfile.findMany()
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
   * // Fetch zero or more UserProfiles
   * const userProfiles = await prisma.userProfile.findMany()
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
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.address`: Exposes CRUD operations for the **Address** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Addresses
    * const addresses = await prisma.address.findMany()
    * ```
    */
  get address(): Prisma.AddressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wishlistItem`: Exposes CRUD operations for the **WishlistItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WishlistItems
    * const wishlistItems = await prisma.wishlistItem.findMany()
    * ```
    */
  get wishlistItem(): Prisma.WishlistItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recentlyViewed`: Exposes CRUD operations for the **RecentlyViewed** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecentlyVieweds
    * const recentlyVieweds = await prisma.recentlyViewed.findMany()
    * ```
    */
  get recentlyViewed(): Prisma.RecentlyViewedDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sellerProfile`: Exposes CRUD operations for the **SellerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SellerProfiles
    * const sellerProfiles = await prisma.sellerProfile.findMany()
    * ```
    */
  get sellerProfile(): Prisma.SellerProfileDelegate<ExtArgs, ClientOptions>;
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
    UserProfile: 'UserProfile',
    Address: 'Address',
    WishlistItem: 'WishlistItem',
    RecentlyViewed: 'RecentlyViewed',
    SellerProfile: 'SellerProfile'
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
      modelProps: "userProfile" | "address" | "wishlistItem" | "recentlyViewed" | "sellerProfile"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      Address: {
        payload: Prisma.$AddressPayload<ExtArgs>
        fields: Prisma.AddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findFirst: {
            args: Prisma.AddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findMany: {
            args: Prisma.AddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          create: {
            args: Prisma.AddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          createMany: {
            args: Prisma.AddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AddressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          delete: {
            args: Prisma.AddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          update: {
            args: Prisma.AddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          deleteMany: {
            args: Prisma.AddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AddressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          upsert: {
            args: Prisma.AddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          aggregate: {
            args: Prisma.AddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAddress>
          }
          groupBy: {
            args: Prisma.AddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<AddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.AddressCountArgs<ExtArgs>
            result: $Utils.Optional<AddressCountAggregateOutputType> | number
          }
        }
      }
      WishlistItem: {
        payload: Prisma.$WishlistItemPayload<ExtArgs>
        fields: Prisma.WishlistItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WishlistItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WishlistItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          findFirst: {
            args: Prisma.WishlistItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WishlistItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          findMany: {
            args: Prisma.WishlistItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          create: {
            args: Prisma.WishlistItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          createMany: {
            args: Prisma.WishlistItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WishlistItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          delete: {
            args: Prisma.WishlistItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          update: {
            args: Prisma.WishlistItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          deleteMany: {
            args: Prisma.WishlistItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WishlistItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WishlistItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[]
          }
          upsert: {
            args: Prisma.WishlistItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>
          }
          aggregate: {
            args: Prisma.WishlistItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWishlistItem>
          }
          groupBy: {
            args: Prisma.WishlistItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<WishlistItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.WishlistItemCountArgs<ExtArgs>
            result: $Utils.Optional<WishlistItemCountAggregateOutputType> | number
          }
        }
      }
      RecentlyViewed: {
        payload: Prisma.$RecentlyViewedPayload<ExtArgs>
        fields: Prisma.RecentlyViewedFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecentlyViewedFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecentlyViewedFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>
          }
          findFirst: {
            args: Prisma.RecentlyViewedFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecentlyViewedFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>
          }
          findMany: {
            args: Prisma.RecentlyViewedFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>[]
          }
          create: {
            args: Prisma.RecentlyViewedCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>
          }
          createMany: {
            args: Prisma.RecentlyViewedCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecentlyViewedCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>[]
          }
          delete: {
            args: Prisma.RecentlyViewedDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>
          }
          update: {
            args: Prisma.RecentlyViewedUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>
          }
          deleteMany: {
            args: Prisma.RecentlyViewedDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecentlyViewedUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecentlyViewedUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>[]
          }
          upsert: {
            args: Prisma.RecentlyViewedUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentlyViewedPayload>
          }
          aggregate: {
            args: Prisma.RecentlyViewedAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecentlyViewed>
          }
          groupBy: {
            args: Prisma.RecentlyViewedGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecentlyViewedGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecentlyViewedCountArgs<ExtArgs>
            result: $Utils.Optional<RecentlyViewedCountAggregateOutputType> | number
          }
        }
      }
      SellerProfile: {
        payload: Prisma.$SellerProfilePayload<ExtArgs>
        fields: Prisma.SellerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SellerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SellerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>
          }
          findFirst: {
            args: Prisma.SellerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SellerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>
          }
          findMany: {
            args: Prisma.SellerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>[]
          }
          create: {
            args: Prisma.SellerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>
          }
          createMany: {
            args: Prisma.SellerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SellerProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>[]
          }
          delete: {
            args: Prisma.SellerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>
          }
          update: {
            args: Prisma.SellerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>
          }
          deleteMany: {
            args: Prisma.SellerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SellerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SellerProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>[]
          }
          upsert: {
            args: Prisma.SellerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SellerProfilePayload>
          }
          aggregate: {
            args: Prisma.SellerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSellerProfile>
          }
          groupBy: {
            args: Prisma.SellerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<SellerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.SellerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<SellerProfileCountAggregateOutputType> | number
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
    userProfile?: UserProfileOmit
    address?: AddressOmit
    wishlistItem?: WishlistItemOmit
    recentlyViewed?: RecentlyViewedOmit
    sellerProfile?: SellerProfileOmit
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
   * Count Type UserProfileCountOutputType
   */

  export type UserProfileCountOutputType = {
    addresses: number
    wishlist: number
  }

  export type UserProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    addresses?: boolean | UserProfileCountOutputTypeCountAddressesArgs
    wishlist?: boolean | UserProfileCountOutputTypeCountWishlistArgs
  }

  // Custom InputTypes
  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfileCountOutputType
     */
    select?: UserProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountAddressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
  }

  /**
   * UserProfileCountOutputType without action
   */
  export type UserProfileCountOutputTypeCountWishlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    dateOfBirth: Date | null
    gender: $Enums.Gender | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    dateOfBirth: Date | null
    gender: $Enums.Gender | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    userId: number
    email: number
    firstName: number
    lastName: number
    phone: number
    avatar: number
    dateOfBirth: number
    gender: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserProfileMinAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatar?: true
    dateOfBirth?: true
    gender?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatar?: true
    dateOfBirth?: true
    gender?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatar?: true
    dateOfBirth?: true
    gender?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    userId: string
    email: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    dateOfBirth: Date | null
    gender: $Enums.Gender | null
    createdAt: Date
    updatedAt: Date
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    addresses?: boolean | UserProfile$addressesArgs<ExtArgs>
    wishlist?: boolean | UserProfile$wishlistArgs<ExtArgs>
    _count?: boolean | UserProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "email" | "firstName" | "lastName" | "phone" | "avatar" | "dateOfBirth" | "gender" | "createdAt" | "updatedAt", ExtArgs["result"]["userProfile"]>
  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    addresses?: boolean | UserProfile$addressesArgs<ExtArgs>
    wishlist?: boolean | UserProfile$wishlistArgs<ExtArgs>
    _count?: boolean | UserProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      addresses: Prisma.$AddressPayload<ExtArgs>[]
      wishlist: Prisma.$WishlistItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      email: string | null
      firstName: string | null
      lastName: string | null
      phone: string | null
      avatar: string | null
      dateOfBirth: Date | null
      gender: $Enums.Gender | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles and returns the data updated in the database.
     * @param {UserProfileUpdateManyAndReturnArgs} args - Arguments to update many UserProfiles.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
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
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    addresses<T extends UserProfile$addressesArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$addressesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wishlist<T extends UserProfile$wishlistArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$wishlistArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the UserProfile model
   */
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly userId: FieldRef<"UserProfile", 'String'>
    readonly email: FieldRef<"UserProfile", 'String'>
    readonly firstName: FieldRef<"UserProfile", 'String'>
    readonly lastName: FieldRef<"UserProfile", 'String'>
    readonly phone: FieldRef<"UserProfile", 'String'>
    readonly avatar: FieldRef<"UserProfile", 'String'>
    readonly dateOfBirth: FieldRef<"UserProfile", 'DateTime'>
    readonly gender: FieldRef<"UserProfile", 'Gender'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile updateManyAndReturn
   */
  export type UserProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to delete.
     */
    limit?: number
  }

  /**
   * UserProfile.addresses
   */
  export type UserProfile$addressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    cursor?: AddressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * UserProfile.wishlist
   */
  export type UserProfile$wishlistArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    where?: WishlistItemWhereInput
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    cursor?: WishlistItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model Address
   */

  export type AggregateAddress = {
    _count: AddressCountAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  export type AddressMinAggregateOutputType = {
    id: string | null
    userProfileId: string | null
    label: string | null
    fullName: string | null
    phone: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    district: string | null
    division: string | null
    postalCode: string | null
    country: string | null
    isDefault: boolean | null
    type: $Enums.AddressType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AddressMaxAggregateOutputType = {
    id: string | null
    userProfileId: string | null
    label: string | null
    fullName: string | null
    phone: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    district: string | null
    division: string | null
    postalCode: string | null
    country: string | null
    isDefault: boolean | null
    type: $Enums.AddressType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AddressCountAggregateOutputType = {
    id: number
    userProfileId: number
    label: number
    fullName: number
    phone: number
    addressLine1: number
    addressLine2: number
    city: number
    district: number
    division: number
    postalCode: number
    country: number
    isDefault: number
    type: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AddressMinAggregateInputType = {
    id?: true
    userProfileId?: true
    label?: true
    fullName?: true
    phone?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    district?: true
    division?: true
    postalCode?: true
    country?: true
    isDefault?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AddressMaxAggregateInputType = {
    id?: true
    userProfileId?: true
    label?: true
    fullName?: true
    phone?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    district?: true
    division?: true
    postalCode?: true
    country?: true
    isDefault?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AddressCountAggregateInputType = {
    id?: true
    userProfileId?: true
    label?: true
    fullName?: true
    phone?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    district?: true
    division?: true
    postalCode?: true
    country?: true
    isDefault?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Address to aggregate.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Addresses
    **/
    _count?: true | AddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AddressMaxAggregateInputType
  }

  export type GetAddressAggregateType<T extends AddressAggregateArgs> = {
        [P in keyof T & keyof AggregateAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAddress[P]>
      : GetScalarType<T[P], AggregateAddress[P]>
  }




  export type AddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithAggregationInput | AddressOrderByWithAggregationInput[]
    by: AddressScalarFieldEnum[] | AddressScalarFieldEnum
    having?: AddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AddressCountAggregateInputType | true
    _min?: AddressMinAggregateInputType
    _max?: AddressMaxAggregateInputType
  }

  export type AddressGroupByOutputType = {
    id: string
    userProfileId: string
    label: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    city: string
    district: string | null
    division: string | null
    postalCode: string | null
    country: string
    isDefault: boolean
    type: $Enums.AddressType
    createdAt: Date
    updatedAt: Date
    _count: AddressCountAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  type GetAddressGroupByPayload<T extends AddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AddressGroupByOutputType[P]>
            : GetScalarType<T[P], AddressGroupByOutputType[P]>
        }
      >
    >


  export type AddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userProfileId?: boolean
    label?: boolean
    fullName?: boolean
    phone?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    district?: boolean
    division?: boolean
    postalCode?: boolean
    country?: boolean
    isDefault?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>

  export type AddressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userProfileId?: boolean
    label?: boolean
    fullName?: boolean
    phone?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    district?: boolean
    division?: boolean
    postalCode?: boolean
    country?: boolean
    isDefault?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>

  export type AddressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userProfileId?: boolean
    label?: boolean
    fullName?: boolean
    phone?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    district?: boolean
    division?: boolean
    postalCode?: boolean
    country?: boolean
    isDefault?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>

  export type AddressSelectScalar = {
    id?: boolean
    userProfileId?: boolean
    label?: boolean
    fullName?: boolean
    phone?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    district?: boolean
    division?: boolean
    postalCode?: boolean
    country?: boolean
    isDefault?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AddressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userProfileId" | "label" | "fullName" | "phone" | "addressLine1" | "addressLine2" | "city" | "district" | "division" | "postalCode" | "country" | "isDefault" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["address"]>
  export type AddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type AddressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type AddressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $AddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Address"
    objects: {
      userProfile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userProfileId: string
      label: string | null
      fullName: string
      phone: string
      addressLine1: string
      addressLine2: string | null
      city: string
      district: string | null
      division: string | null
      postalCode: string | null
      country: string
      isDefault: boolean
      type: $Enums.AddressType
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["address"]>
    composites: {}
  }

  type AddressGetPayload<S extends boolean | null | undefined | AddressDefaultArgs> = $Result.GetResult<Prisma.$AddressPayload, S>

  type AddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AddressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AddressCountAggregateInputType | true
    }

  export interface AddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Address'], meta: { name: 'Address' } }
    /**
     * Find zero or one Address that matches the filter.
     * @param {AddressFindUniqueArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AddressFindUniqueArgs>(args: SelectSubset<T, AddressFindUniqueArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Address that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AddressFindUniqueOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AddressFindUniqueOrThrowArgs>(args: SelectSubset<T, AddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AddressFindFirstArgs>(args?: SelectSubset<T, AddressFindFirstArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AddressFindFirstOrThrowArgs>(args?: SelectSubset<T, AddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Addresses
     * const addresses = await prisma.address.findMany()
     * 
     * // Get first 10 Addresses
     * const addresses = await prisma.address.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const addressWithIdOnly = await prisma.address.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AddressFindManyArgs>(args?: SelectSubset<T, AddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Address.
     * @param {AddressCreateArgs} args - Arguments to create a Address.
     * @example
     * // Create one Address
     * const Address = await prisma.address.create({
     *   data: {
     *     // ... data to create a Address
     *   }
     * })
     * 
     */
    create<T extends AddressCreateArgs>(args: SelectSubset<T, AddressCreateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Addresses.
     * @param {AddressCreateManyArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AddressCreateManyArgs>(args?: SelectSubset<T, AddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Addresses and returns the data saved in the database.
     * @param {AddressCreateManyAndReturnArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Addresses and only return the `id`
     * const addressWithIdOnly = await prisma.address.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AddressCreateManyAndReturnArgs>(args?: SelectSubset<T, AddressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Address.
     * @param {AddressDeleteArgs} args - Arguments to delete one Address.
     * @example
     * // Delete one Address
     * const Address = await prisma.address.delete({
     *   where: {
     *     // ... filter to delete one Address
     *   }
     * })
     * 
     */
    delete<T extends AddressDeleteArgs>(args: SelectSubset<T, AddressDeleteArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Address.
     * @param {AddressUpdateArgs} args - Arguments to update one Address.
     * @example
     * // Update one Address
     * const address = await prisma.address.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AddressUpdateArgs>(args: SelectSubset<T, AddressUpdateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Addresses.
     * @param {AddressDeleteManyArgs} args - Arguments to filter Addresses to delete.
     * @example
     * // Delete a few Addresses
     * const { count } = await prisma.address.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AddressDeleteManyArgs>(args?: SelectSubset<T, AddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AddressUpdateManyArgs>(args: SelectSubset<T, AddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses and returns the data updated in the database.
     * @param {AddressUpdateManyAndReturnArgs} args - Arguments to update many Addresses.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Addresses and only return the `id`
     * const addressWithIdOnly = await prisma.address.updateManyAndReturn({
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
    updateManyAndReturn<T extends AddressUpdateManyAndReturnArgs>(args: SelectSubset<T, AddressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Address.
     * @param {AddressUpsertArgs} args - Arguments to update or create a Address.
     * @example
     * // Update or create a Address
     * const address = await prisma.address.upsert({
     *   create: {
     *     // ... data to create a Address
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Address we want to update
     *   }
     * })
     */
    upsert<T extends AddressUpsertArgs>(args: SelectSubset<T, AddressUpsertArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressCountArgs} args - Arguments to filter Addresses to count.
     * @example
     * // Count the number of Addresses
     * const count = await prisma.address.count({
     *   where: {
     *     // ... the filter for the Addresses we want to count
     *   }
     * })
    **/
    count<T extends AddressCountArgs>(
      args?: Subset<T, AddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AddressAggregateArgs>(args: Subset<T, AddressAggregateArgs>): Prisma.PrismaPromise<GetAddressAggregateType<T>>

    /**
     * Group by Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressGroupByArgs} args - Group by arguments.
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
      T extends AddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AddressGroupByArgs['orderBy'] }
        : { orderBy?: AddressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Address model
   */
  readonly fields: AddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Address.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userProfile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Address model
   */
  interface AddressFieldRefs {
    readonly id: FieldRef<"Address", 'String'>
    readonly userProfileId: FieldRef<"Address", 'String'>
    readonly label: FieldRef<"Address", 'String'>
    readonly fullName: FieldRef<"Address", 'String'>
    readonly phone: FieldRef<"Address", 'String'>
    readonly addressLine1: FieldRef<"Address", 'String'>
    readonly addressLine2: FieldRef<"Address", 'String'>
    readonly city: FieldRef<"Address", 'String'>
    readonly district: FieldRef<"Address", 'String'>
    readonly division: FieldRef<"Address", 'String'>
    readonly postalCode: FieldRef<"Address", 'String'>
    readonly country: FieldRef<"Address", 'String'>
    readonly isDefault: FieldRef<"Address", 'Boolean'>
    readonly type: FieldRef<"Address", 'AddressType'>
    readonly createdAt: FieldRef<"Address", 'DateTime'>
    readonly updatedAt: FieldRef<"Address", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Address findUnique
   */
  export type AddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findUniqueOrThrow
   */
  export type AddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findFirst
   */
  export type AddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findFirstOrThrow
   */
  export type AddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findMany
   */
  export type AddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Addresses to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address create
   */
  export type AddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to create a Address.
     */
    data: XOR<AddressCreateInput, AddressUncheckedCreateInput>
  }

  /**
   * Address createMany
   */
  export type AddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Address createManyAndReturn
   */
  export type AddressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Address update
   */
  export type AddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to update a Address.
     */
    data: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
    /**
     * Choose, which Address to update.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address updateMany
   */
  export type AddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to update.
     */
    limit?: number
  }

  /**
   * Address updateManyAndReturn
   */
  export type AddressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Address upsert
   */
  export type AddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The filter to search for the Address to update in case it exists.
     */
    where: AddressWhereUniqueInput
    /**
     * In case the Address found by the `where` argument doesn't exist, create a new Address with this data.
     */
    create: XOR<AddressCreateInput, AddressUncheckedCreateInput>
    /**
     * In case the Address was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
  }

  /**
   * Address delete
   */
  export type AddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter which Address to delete.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address deleteMany
   */
  export type AddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Addresses to delete
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to delete.
     */
    limit?: number
  }

  /**
   * Address without action
   */
  export type AddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
  }


  /**
   * Model WishlistItem
   */

  export type AggregateWishlistItem = {
    _count: WishlistItemCountAggregateOutputType | null
    _min: WishlistItemMinAggregateOutputType | null
    _max: WishlistItemMaxAggregateOutputType | null
  }

  export type WishlistItemMinAggregateOutputType = {
    id: string | null
    userProfileId: string | null
    productId: string | null
    addedAt: Date | null
  }

  export type WishlistItemMaxAggregateOutputType = {
    id: string | null
    userProfileId: string | null
    productId: string | null
    addedAt: Date | null
  }

  export type WishlistItemCountAggregateOutputType = {
    id: number
    userProfileId: number
    productId: number
    addedAt: number
    _all: number
  }


  export type WishlistItemMinAggregateInputType = {
    id?: true
    userProfileId?: true
    productId?: true
    addedAt?: true
  }

  export type WishlistItemMaxAggregateInputType = {
    id?: true
    userProfileId?: true
    productId?: true
    addedAt?: true
  }

  export type WishlistItemCountAggregateInputType = {
    id?: true
    userProfileId?: true
    productId?: true
    addedAt?: true
    _all?: true
  }

  export type WishlistItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WishlistItem to aggregate.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WishlistItems
    **/
    _count?: true | WishlistItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WishlistItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WishlistItemMaxAggregateInputType
  }

  export type GetWishlistItemAggregateType<T extends WishlistItemAggregateArgs> = {
        [P in keyof T & keyof AggregateWishlistItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWishlistItem[P]>
      : GetScalarType<T[P], AggregateWishlistItem[P]>
  }




  export type WishlistItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistItemWhereInput
    orderBy?: WishlistItemOrderByWithAggregationInput | WishlistItemOrderByWithAggregationInput[]
    by: WishlistItemScalarFieldEnum[] | WishlistItemScalarFieldEnum
    having?: WishlistItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WishlistItemCountAggregateInputType | true
    _min?: WishlistItemMinAggregateInputType
    _max?: WishlistItemMaxAggregateInputType
  }

  export type WishlistItemGroupByOutputType = {
    id: string
    userProfileId: string
    productId: string
    addedAt: Date
    _count: WishlistItemCountAggregateOutputType | null
    _min: WishlistItemMinAggregateOutputType | null
    _max: WishlistItemMaxAggregateOutputType | null
  }

  type GetWishlistItemGroupByPayload<T extends WishlistItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WishlistItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WishlistItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
            : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
        }
      >
    >


  export type WishlistItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userProfileId?: boolean
    productId?: boolean
    addedAt?: boolean
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userProfileId?: boolean
    productId?: boolean
    addedAt?: boolean
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userProfileId?: boolean
    productId?: boolean
    addedAt?: boolean
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wishlistItem"]>

  export type WishlistItemSelectScalar = {
    id?: boolean
    userProfileId?: boolean
    productId?: boolean
    addedAt?: boolean
  }

  export type WishlistItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userProfileId" | "productId" | "addedAt", ExtArgs["result"]["wishlistItem"]>
  export type WishlistItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type WishlistItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }
  export type WishlistItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProfile?: boolean | UserProfileDefaultArgs<ExtArgs>
  }

  export type $WishlistItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WishlistItem"
    objects: {
      userProfile: Prisma.$UserProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userProfileId: string
      productId: string
      addedAt: Date
    }, ExtArgs["result"]["wishlistItem"]>
    composites: {}
  }

  type WishlistItemGetPayload<S extends boolean | null | undefined | WishlistItemDefaultArgs> = $Result.GetResult<Prisma.$WishlistItemPayload, S>

  type WishlistItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WishlistItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WishlistItemCountAggregateInputType | true
    }

  export interface WishlistItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WishlistItem'], meta: { name: 'WishlistItem' } }
    /**
     * Find zero or one WishlistItem that matches the filter.
     * @param {WishlistItemFindUniqueArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WishlistItemFindUniqueArgs>(args: SelectSubset<T, WishlistItemFindUniqueArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WishlistItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WishlistItemFindUniqueOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WishlistItemFindUniqueOrThrowArgs>(args: SelectSubset<T, WishlistItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WishlistItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WishlistItemFindFirstArgs>(args?: SelectSubset<T, WishlistItemFindFirstArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WishlistItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WishlistItemFindFirstOrThrowArgs>(args?: SelectSubset<T, WishlistItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WishlistItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany()
     * 
     * // Get first 10 WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WishlistItemFindManyArgs>(args?: SelectSubset<T, WishlistItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WishlistItem.
     * @param {WishlistItemCreateArgs} args - Arguments to create a WishlistItem.
     * @example
     * // Create one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.create({
     *   data: {
     *     // ... data to create a WishlistItem
     *   }
     * })
     * 
     */
    create<T extends WishlistItemCreateArgs>(args: SelectSubset<T, WishlistItemCreateArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WishlistItems.
     * @param {WishlistItemCreateManyArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WishlistItemCreateManyArgs>(args?: SelectSubset<T, WishlistItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WishlistItems and returns the data saved in the database.
     * @param {WishlistItemCreateManyAndReturnArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WishlistItems and only return the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WishlistItemCreateManyAndReturnArgs>(args?: SelectSubset<T, WishlistItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WishlistItem.
     * @param {WishlistItemDeleteArgs} args - Arguments to delete one WishlistItem.
     * @example
     * // Delete one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.delete({
     *   where: {
     *     // ... filter to delete one WishlistItem
     *   }
     * })
     * 
     */
    delete<T extends WishlistItemDeleteArgs>(args: SelectSubset<T, WishlistItemDeleteArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WishlistItem.
     * @param {WishlistItemUpdateArgs} args - Arguments to update one WishlistItem.
     * @example
     * // Update one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WishlistItemUpdateArgs>(args: SelectSubset<T, WishlistItemUpdateArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WishlistItems.
     * @param {WishlistItemDeleteManyArgs} args - Arguments to filter WishlistItems to delete.
     * @example
     * // Delete a few WishlistItems
     * const { count } = await prisma.wishlistItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WishlistItemDeleteManyArgs>(args?: SelectSubset<T, WishlistItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WishlistItemUpdateManyArgs>(args: SelectSubset<T, WishlistItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WishlistItems and returns the data updated in the database.
     * @param {WishlistItemUpdateManyAndReturnArgs} args - Arguments to update many WishlistItems.
     * @example
     * // Update many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WishlistItems and only return the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends WishlistItemUpdateManyAndReturnArgs>(args: SelectSubset<T, WishlistItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WishlistItem.
     * @param {WishlistItemUpsertArgs} args - Arguments to update or create a WishlistItem.
     * @example
     * // Update or create a WishlistItem
     * const wishlistItem = await prisma.wishlistItem.upsert({
     *   create: {
     *     // ... data to create a WishlistItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WishlistItem we want to update
     *   }
     * })
     */
    upsert<T extends WishlistItemUpsertArgs>(args: SelectSubset<T, WishlistItemUpsertArgs<ExtArgs>>): Prisma__WishlistItemClient<$Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemCountArgs} args - Arguments to filter WishlistItems to count.
     * @example
     * // Count the number of WishlistItems
     * const count = await prisma.wishlistItem.count({
     *   where: {
     *     // ... the filter for the WishlistItems we want to count
     *   }
     * })
    **/
    count<T extends WishlistItemCountArgs>(
      args?: Subset<T, WishlistItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WishlistItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WishlistItemAggregateArgs>(args: Subset<T, WishlistItemAggregateArgs>): Prisma.PrismaPromise<GetWishlistItemAggregateType<T>>

    /**
     * Group by WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemGroupByArgs} args - Group by arguments.
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
      T extends WishlistItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WishlistItemGroupByArgs['orderBy'] }
        : { orderBy?: WishlistItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WishlistItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWishlistItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WishlistItem model
   */
  readonly fields: WishlistItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WishlistItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WishlistItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userProfile<T extends UserProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProfileDefaultArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WishlistItem model
   */
  interface WishlistItemFieldRefs {
    readonly id: FieldRef<"WishlistItem", 'String'>
    readonly userProfileId: FieldRef<"WishlistItem", 'String'>
    readonly productId: FieldRef<"WishlistItem", 'String'>
    readonly addedAt: FieldRef<"WishlistItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WishlistItem findUnique
   */
  export type WishlistItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem findUniqueOrThrow
   */
  export type WishlistItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem findFirst
   */
  export type WishlistItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem findFirstOrThrow
   */
  export type WishlistItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem findMany
   */
  export type WishlistItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * Filter, which WishlistItems to fetch.
     */
    where?: WishlistItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?: WishlistItemOrderByWithRelationInput | WishlistItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WishlistItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[]
  }

  /**
   * WishlistItem create
   */
  export type WishlistItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * The data needed to create a WishlistItem.
     */
    data: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>
  }

  /**
   * WishlistItem createMany
   */
  export type WishlistItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WishlistItem createManyAndReturn
   */
  export type WishlistItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WishlistItem update
   */
  export type WishlistItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * The data needed to update a WishlistItem.
     */
    data: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>
    /**
     * Choose, which WishlistItem to update.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem updateMany
   */
  export type WishlistItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WishlistItems.
     */
    data: XOR<WishlistItemUpdateManyMutationInput, WishlistItemUncheckedUpdateManyInput>
    /**
     * Filter which WishlistItems to update
     */
    where?: WishlistItemWhereInput
    /**
     * Limit how many WishlistItems to update.
     */
    limit?: number
  }

  /**
   * WishlistItem updateManyAndReturn
   */
  export type WishlistItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * The data used to update WishlistItems.
     */
    data: XOR<WishlistItemUpdateManyMutationInput, WishlistItemUncheckedUpdateManyInput>
    /**
     * Filter which WishlistItems to update
     */
    where?: WishlistItemWhereInput
    /**
     * Limit how many WishlistItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WishlistItem upsert
   */
  export type WishlistItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * The filter to search for the WishlistItem to update in case it exists.
     */
    where: WishlistItemWhereUniqueInput
    /**
     * In case the WishlistItem found by the `where` argument doesn't exist, create a new WishlistItem with this data.
     */
    create: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>
    /**
     * In case the WishlistItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>
  }

  /**
   * WishlistItem delete
   */
  export type WishlistItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
    /**
     * Filter which WishlistItem to delete.
     */
    where: WishlistItemWhereUniqueInput
  }

  /**
   * WishlistItem deleteMany
   */
  export type WishlistItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WishlistItems to delete
     */
    where?: WishlistItemWhereInput
    /**
     * Limit how many WishlistItems to delete.
     */
    limit?: number
  }

  /**
   * WishlistItem without action
   */
  export type WishlistItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WishlistItem
     */
    omit?: WishlistItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null
  }


  /**
   * Model RecentlyViewed
   */

  export type AggregateRecentlyViewed = {
    _count: RecentlyViewedCountAggregateOutputType | null
    _min: RecentlyViewedMinAggregateOutputType | null
    _max: RecentlyViewedMaxAggregateOutputType | null
  }

  export type RecentlyViewedMinAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    viewedAt: Date | null
  }

  export type RecentlyViewedMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    viewedAt: Date | null
  }

  export type RecentlyViewedCountAggregateOutputType = {
    id: number
    userId: number
    productId: number
    viewedAt: number
    _all: number
  }


  export type RecentlyViewedMinAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    viewedAt?: true
  }

  export type RecentlyViewedMaxAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    viewedAt?: true
  }

  export type RecentlyViewedCountAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    viewedAt?: true
    _all?: true
  }

  export type RecentlyViewedAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecentlyViewed to aggregate.
     */
    where?: RecentlyViewedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentlyVieweds to fetch.
     */
    orderBy?: RecentlyViewedOrderByWithRelationInput | RecentlyViewedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecentlyViewedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentlyVieweds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentlyVieweds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecentlyVieweds
    **/
    _count?: true | RecentlyViewedCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecentlyViewedMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecentlyViewedMaxAggregateInputType
  }

  export type GetRecentlyViewedAggregateType<T extends RecentlyViewedAggregateArgs> = {
        [P in keyof T & keyof AggregateRecentlyViewed]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecentlyViewed[P]>
      : GetScalarType<T[P], AggregateRecentlyViewed[P]>
  }




  export type RecentlyViewedGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecentlyViewedWhereInput
    orderBy?: RecentlyViewedOrderByWithAggregationInput | RecentlyViewedOrderByWithAggregationInput[]
    by: RecentlyViewedScalarFieldEnum[] | RecentlyViewedScalarFieldEnum
    having?: RecentlyViewedScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecentlyViewedCountAggregateInputType | true
    _min?: RecentlyViewedMinAggregateInputType
    _max?: RecentlyViewedMaxAggregateInputType
  }

  export type RecentlyViewedGroupByOutputType = {
    id: string
    userId: string
    productId: string
    viewedAt: Date
    _count: RecentlyViewedCountAggregateOutputType | null
    _min: RecentlyViewedMinAggregateOutputType | null
    _max: RecentlyViewedMaxAggregateOutputType | null
  }

  type GetRecentlyViewedGroupByPayload<T extends RecentlyViewedGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecentlyViewedGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecentlyViewedGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecentlyViewedGroupByOutputType[P]>
            : GetScalarType<T[P], RecentlyViewedGroupByOutputType[P]>
        }
      >
    >


  export type RecentlyViewedSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    viewedAt?: boolean
  }, ExtArgs["result"]["recentlyViewed"]>

  export type RecentlyViewedSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    viewedAt?: boolean
  }, ExtArgs["result"]["recentlyViewed"]>

  export type RecentlyViewedSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    viewedAt?: boolean
  }, ExtArgs["result"]["recentlyViewed"]>

  export type RecentlyViewedSelectScalar = {
    id?: boolean
    userId?: boolean
    productId?: boolean
    viewedAt?: boolean
  }

  export type RecentlyViewedOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "productId" | "viewedAt", ExtArgs["result"]["recentlyViewed"]>

  export type $RecentlyViewedPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecentlyViewed"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      productId: string
      viewedAt: Date
    }, ExtArgs["result"]["recentlyViewed"]>
    composites: {}
  }

  type RecentlyViewedGetPayload<S extends boolean | null | undefined | RecentlyViewedDefaultArgs> = $Result.GetResult<Prisma.$RecentlyViewedPayload, S>

  type RecentlyViewedCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecentlyViewedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecentlyViewedCountAggregateInputType | true
    }

  export interface RecentlyViewedDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecentlyViewed'], meta: { name: 'RecentlyViewed' } }
    /**
     * Find zero or one RecentlyViewed that matches the filter.
     * @param {RecentlyViewedFindUniqueArgs} args - Arguments to find a RecentlyViewed
     * @example
     * // Get one RecentlyViewed
     * const recentlyViewed = await prisma.recentlyViewed.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecentlyViewedFindUniqueArgs>(args: SelectSubset<T, RecentlyViewedFindUniqueArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecentlyViewed that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecentlyViewedFindUniqueOrThrowArgs} args - Arguments to find a RecentlyViewed
     * @example
     * // Get one RecentlyViewed
     * const recentlyViewed = await prisma.recentlyViewed.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecentlyViewedFindUniqueOrThrowArgs>(args: SelectSubset<T, RecentlyViewedFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecentlyViewed that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedFindFirstArgs} args - Arguments to find a RecentlyViewed
     * @example
     * // Get one RecentlyViewed
     * const recentlyViewed = await prisma.recentlyViewed.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecentlyViewedFindFirstArgs>(args?: SelectSubset<T, RecentlyViewedFindFirstArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecentlyViewed that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedFindFirstOrThrowArgs} args - Arguments to find a RecentlyViewed
     * @example
     * // Get one RecentlyViewed
     * const recentlyViewed = await prisma.recentlyViewed.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecentlyViewedFindFirstOrThrowArgs>(args?: SelectSubset<T, RecentlyViewedFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecentlyVieweds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecentlyVieweds
     * const recentlyVieweds = await prisma.recentlyViewed.findMany()
     * 
     * // Get first 10 RecentlyVieweds
     * const recentlyVieweds = await prisma.recentlyViewed.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recentlyViewedWithIdOnly = await prisma.recentlyViewed.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecentlyViewedFindManyArgs>(args?: SelectSubset<T, RecentlyViewedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecentlyViewed.
     * @param {RecentlyViewedCreateArgs} args - Arguments to create a RecentlyViewed.
     * @example
     * // Create one RecentlyViewed
     * const RecentlyViewed = await prisma.recentlyViewed.create({
     *   data: {
     *     // ... data to create a RecentlyViewed
     *   }
     * })
     * 
     */
    create<T extends RecentlyViewedCreateArgs>(args: SelectSubset<T, RecentlyViewedCreateArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecentlyVieweds.
     * @param {RecentlyViewedCreateManyArgs} args - Arguments to create many RecentlyVieweds.
     * @example
     * // Create many RecentlyVieweds
     * const recentlyViewed = await prisma.recentlyViewed.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecentlyViewedCreateManyArgs>(args?: SelectSubset<T, RecentlyViewedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecentlyVieweds and returns the data saved in the database.
     * @param {RecentlyViewedCreateManyAndReturnArgs} args - Arguments to create many RecentlyVieweds.
     * @example
     * // Create many RecentlyVieweds
     * const recentlyViewed = await prisma.recentlyViewed.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecentlyVieweds and only return the `id`
     * const recentlyViewedWithIdOnly = await prisma.recentlyViewed.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecentlyViewedCreateManyAndReturnArgs>(args?: SelectSubset<T, RecentlyViewedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecentlyViewed.
     * @param {RecentlyViewedDeleteArgs} args - Arguments to delete one RecentlyViewed.
     * @example
     * // Delete one RecentlyViewed
     * const RecentlyViewed = await prisma.recentlyViewed.delete({
     *   where: {
     *     // ... filter to delete one RecentlyViewed
     *   }
     * })
     * 
     */
    delete<T extends RecentlyViewedDeleteArgs>(args: SelectSubset<T, RecentlyViewedDeleteArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecentlyViewed.
     * @param {RecentlyViewedUpdateArgs} args - Arguments to update one RecentlyViewed.
     * @example
     * // Update one RecentlyViewed
     * const recentlyViewed = await prisma.recentlyViewed.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecentlyViewedUpdateArgs>(args: SelectSubset<T, RecentlyViewedUpdateArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecentlyVieweds.
     * @param {RecentlyViewedDeleteManyArgs} args - Arguments to filter RecentlyVieweds to delete.
     * @example
     * // Delete a few RecentlyVieweds
     * const { count } = await prisma.recentlyViewed.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecentlyViewedDeleteManyArgs>(args?: SelectSubset<T, RecentlyViewedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecentlyVieweds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecentlyVieweds
     * const recentlyViewed = await prisma.recentlyViewed.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecentlyViewedUpdateManyArgs>(args: SelectSubset<T, RecentlyViewedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecentlyVieweds and returns the data updated in the database.
     * @param {RecentlyViewedUpdateManyAndReturnArgs} args - Arguments to update many RecentlyVieweds.
     * @example
     * // Update many RecentlyVieweds
     * const recentlyViewed = await prisma.recentlyViewed.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecentlyVieweds and only return the `id`
     * const recentlyViewedWithIdOnly = await prisma.recentlyViewed.updateManyAndReturn({
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
    updateManyAndReturn<T extends RecentlyViewedUpdateManyAndReturnArgs>(args: SelectSubset<T, RecentlyViewedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecentlyViewed.
     * @param {RecentlyViewedUpsertArgs} args - Arguments to update or create a RecentlyViewed.
     * @example
     * // Update or create a RecentlyViewed
     * const recentlyViewed = await prisma.recentlyViewed.upsert({
     *   create: {
     *     // ... data to create a RecentlyViewed
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecentlyViewed we want to update
     *   }
     * })
     */
    upsert<T extends RecentlyViewedUpsertArgs>(args: SelectSubset<T, RecentlyViewedUpsertArgs<ExtArgs>>): Prisma__RecentlyViewedClient<$Result.GetResult<Prisma.$RecentlyViewedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecentlyVieweds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedCountArgs} args - Arguments to filter RecentlyVieweds to count.
     * @example
     * // Count the number of RecentlyVieweds
     * const count = await prisma.recentlyViewed.count({
     *   where: {
     *     // ... the filter for the RecentlyVieweds we want to count
     *   }
     * })
    **/
    count<T extends RecentlyViewedCountArgs>(
      args?: Subset<T, RecentlyViewedCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecentlyViewedCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecentlyViewed.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RecentlyViewedAggregateArgs>(args: Subset<T, RecentlyViewedAggregateArgs>): Prisma.PrismaPromise<GetRecentlyViewedAggregateType<T>>

    /**
     * Group by RecentlyViewed.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentlyViewedGroupByArgs} args - Group by arguments.
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
      T extends RecentlyViewedGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecentlyViewedGroupByArgs['orderBy'] }
        : { orderBy?: RecentlyViewedGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RecentlyViewedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecentlyViewedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecentlyViewed model
   */
  readonly fields: RecentlyViewedFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecentlyViewed.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecentlyViewedClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the RecentlyViewed model
   */
  interface RecentlyViewedFieldRefs {
    readonly id: FieldRef<"RecentlyViewed", 'String'>
    readonly userId: FieldRef<"RecentlyViewed", 'String'>
    readonly productId: FieldRef<"RecentlyViewed", 'String'>
    readonly viewedAt: FieldRef<"RecentlyViewed", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RecentlyViewed findUnique
   */
  export type RecentlyViewedFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * Filter, which RecentlyViewed to fetch.
     */
    where: RecentlyViewedWhereUniqueInput
  }

  /**
   * RecentlyViewed findUniqueOrThrow
   */
  export type RecentlyViewedFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * Filter, which RecentlyViewed to fetch.
     */
    where: RecentlyViewedWhereUniqueInput
  }

  /**
   * RecentlyViewed findFirst
   */
  export type RecentlyViewedFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * Filter, which RecentlyViewed to fetch.
     */
    where?: RecentlyViewedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentlyVieweds to fetch.
     */
    orderBy?: RecentlyViewedOrderByWithRelationInput | RecentlyViewedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecentlyVieweds.
     */
    cursor?: RecentlyViewedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentlyVieweds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentlyVieweds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentlyVieweds.
     */
    distinct?: RecentlyViewedScalarFieldEnum | RecentlyViewedScalarFieldEnum[]
  }

  /**
   * RecentlyViewed findFirstOrThrow
   */
  export type RecentlyViewedFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * Filter, which RecentlyViewed to fetch.
     */
    where?: RecentlyViewedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentlyVieweds to fetch.
     */
    orderBy?: RecentlyViewedOrderByWithRelationInput | RecentlyViewedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecentlyVieweds.
     */
    cursor?: RecentlyViewedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentlyVieweds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentlyVieweds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentlyVieweds.
     */
    distinct?: RecentlyViewedScalarFieldEnum | RecentlyViewedScalarFieldEnum[]
  }

  /**
   * RecentlyViewed findMany
   */
  export type RecentlyViewedFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * Filter, which RecentlyVieweds to fetch.
     */
    where?: RecentlyViewedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentlyVieweds to fetch.
     */
    orderBy?: RecentlyViewedOrderByWithRelationInput | RecentlyViewedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecentlyVieweds.
     */
    cursor?: RecentlyViewedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentlyVieweds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentlyVieweds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentlyVieweds.
     */
    distinct?: RecentlyViewedScalarFieldEnum | RecentlyViewedScalarFieldEnum[]
  }

  /**
   * RecentlyViewed create
   */
  export type RecentlyViewedCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * The data needed to create a RecentlyViewed.
     */
    data: XOR<RecentlyViewedCreateInput, RecentlyViewedUncheckedCreateInput>
  }

  /**
   * RecentlyViewed createMany
   */
  export type RecentlyViewedCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecentlyVieweds.
     */
    data: RecentlyViewedCreateManyInput | RecentlyViewedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecentlyViewed createManyAndReturn
   */
  export type RecentlyViewedCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * The data used to create many RecentlyVieweds.
     */
    data: RecentlyViewedCreateManyInput | RecentlyViewedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecentlyViewed update
   */
  export type RecentlyViewedUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * The data needed to update a RecentlyViewed.
     */
    data: XOR<RecentlyViewedUpdateInput, RecentlyViewedUncheckedUpdateInput>
    /**
     * Choose, which RecentlyViewed to update.
     */
    where: RecentlyViewedWhereUniqueInput
  }

  /**
   * RecentlyViewed updateMany
   */
  export type RecentlyViewedUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecentlyVieweds.
     */
    data: XOR<RecentlyViewedUpdateManyMutationInput, RecentlyViewedUncheckedUpdateManyInput>
    /**
     * Filter which RecentlyVieweds to update
     */
    where?: RecentlyViewedWhereInput
    /**
     * Limit how many RecentlyVieweds to update.
     */
    limit?: number
  }

  /**
   * RecentlyViewed updateManyAndReturn
   */
  export type RecentlyViewedUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * The data used to update RecentlyVieweds.
     */
    data: XOR<RecentlyViewedUpdateManyMutationInput, RecentlyViewedUncheckedUpdateManyInput>
    /**
     * Filter which RecentlyVieweds to update
     */
    where?: RecentlyViewedWhereInput
    /**
     * Limit how many RecentlyVieweds to update.
     */
    limit?: number
  }

  /**
   * RecentlyViewed upsert
   */
  export type RecentlyViewedUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * The filter to search for the RecentlyViewed to update in case it exists.
     */
    where: RecentlyViewedWhereUniqueInput
    /**
     * In case the RecentlyViewed found by the `where` argument doesn't exist, create a new RecentlyViewed with this data.
     */
    create: XOR<RecentlyViewedCreateInput, RecentlyViewedUncheckedCreateInput>
    /**
     * In case the RecentlyViewed was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecentlyViewedUpdateInput, RecentlyViewedUncheckedUpdateInput>
  }

  /**
   * RecentlyViewed delete
   */
  export type RecentlyViewedDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
    /**
     * Filter which RecentlyViewed to delete.
     */
    where: RecentlyViewedWhereUniqueInput
  }

  /**
   * RecentlyViewed deleteMany
   */
  export type RecentlyViewedDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecentlyVieweds to delete
     */
    where?: RecentlyViewedWhereInput
    /**
     * Limit how many RecentlyVieweds to delete.
     */
    limit?: number
  }

  /**
   * RecentlyViewed without action
   */
  export type RecentlyViewedDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentlyViewed
     */
    select?: RecentlyViewedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentlyViewed
     */
    omit?: RecentlyViewedOmit<ExtArgs> | null
  }


  /**
   * Model SellerProfile
   */

  export type AggregateSellerProfile = {
    _count: SellerProfileCountAggregateOutputType | null
    _avg: SellerProfileAvgAggregateOutputType | null
    _sum: SellerProfileSumAggregateOutputType | null
    _min: SellerProfileMinAggregateOutputType | null
    _max: SellerProfileMaxAggregateOutputType | null
  }

  export type SellerProfileAvgAggregateOutputType = {
    rating: number | null
    ratingCount: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    completionRate: number | null
    returnRate: number | null
  }

  export type SellerProfileSumAggregateOutputType = {
    rating: number | null
    ratingCount: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    completionRate: number | null
    returnRate: number | null
  }

  export type SellerProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    shopName: string | null
    shopSlug: string | null
    shopDescription: string | null
    shopLogo: string | null
    shopBanner: string | null
    phone: string | null
    email: string | null
    address: string | null
    city: string | null
    postalCode: string | null
    businessLicense: string | null
    nidNumber: string | null
    tin: string | null
    status: $Enums.SellerStatus | null
    isVerified: boolean | null
    documentVerified: boolean | null
    rating: number | null
    ratingCount: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    completionRate: number | null
    returnRate: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SellerProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    shopName: string | null
    shopSlug: string | null
    shopDescription: string | null
    shopLogo: string | null
    shopBanner: string | null
    phone: string | null
    email: string | null
    address: string | null
    city: string | null
    postalCode: string | null
    businessLicense: string | null
    nidNumber: string | null
    tin: string | null
    status: $Enums.SellerStatus | null
    isVerified: boolean | null
    documentVerified: boolean | null
    rating: number | null
    ratingCount: number | null
    totalOrders: number | null
    totalRevenue: Decimal | null
    completionRate: number | null
    returnRate: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SellerProfileCountAggregateOutputType = {
    id: number
    userId: number
    shopName: number
    shopSlug: number
    shopDescription: number
    shopLogo: number
    shopBanner: number
    phone: number
    email: number
    address: number
    city: number
    postalCode: number
    businessLicense: number
    nidNumber: number
    tin: number
    status: number
    isVerified: number
    documentVerified: number
    rating: number
    ratingCount: number
    totalOrders: number
    totalRevenue: number
    completionRate: number
    returnRate: number
    operatingHours: number
    bankDetails: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SellerProfileAvgAggregateInputType = {
    rating?: true
    ratingCount?: true
    totalOrders?: true
    totalRevenue?: true
    completionRate?: true
    returnRate?: true
  }

  export type SellerProfileSumAggregateInputType = {
    rating?: true
    ratingCount?: true
    totalOrders?: true
    totalRevenue?: true
    completionRate?: true
    returnRate?: true
  }

  export type SellerProfileMinAggregateInputType = {
    id?: true
    userId?: true
    shopName?: true
    shopSlug?: true
    shopDescription?: true
    shopLogo?: true
    shopBanner?: true
    phone?: true
    email?: true
    address?: true
    city?: true
    postalCode?: true
    businessLicense?: true
    nidNumber?: true
    tin?: true
    status?: true
    isVerified?: true
    documentVerified?: true
    rating?: true
    ratingCount?: true
    totalOrders?: true
    totalRevenue?: true
    completionRate?: true
    returnRate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SellerProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    shopName?: true
    shopSlug?: true
    shopDescription?: true
    shopLogo?: true
    shopBanner?: true
    phone?: true
    email?: true
    address?: true
    city?: true
    postalCode?: true
    businessLicense?: true
    nidNumber?: true
    tin?: true
    status?: true
    isVerified?: true
    documentVerified?: true
    rating?: true
    ratingCount?: true
    totalOrders?: true
    totalRevenue?: true
    completionRate?: true
    returnRate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SellerProfileCountAggregateInputType = {
    id?: true
    userId?: true
    shopName?: true
    shopSlug?: true
    shopDescription?: true
    shopLogo?: true
    shopBanner?: true
    phone?: true
    email?: true
    address?: true
    city?: true
    postalCode?: true
    businessLicense?: true
    nidNumber?: true
    tin?: true
    status?: true
    isVerified?: true
    documentVerified?: true
    rating?: true
    ratingCount?: true
    totalOrders?: true
    totalRevenue?: true
    completionRate?: true
    returnRate?: true
    operatingHours?: true
    bankDetails?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SellerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SellerProfile to aggregate.
     */
    where?: SellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProfiles to fetch.
     */
    orderBy?: SellerProfileOrderByWithRelationInput | SellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SellerProfiles
    **/
    _count?: true | SellerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SellerProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SellerProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SellerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SellerProfileMaxAggregateInputType
  }

  export type GetSellerProfileAggregateType<T extends SellerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateSellerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSellerProfile[P]>
      : GetScalarType<T[P], AggregateSellerProfile[P]>
  }




  export type SellerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SellerProfileWhereInput
    orderBy?: SellerProfileOrderByWithAggregationInput | SellerProfileOrderByWithAggregationInput[]
    by: SellerProfileScalarFieldEnum[] | SellerProfileScalarFieldEnum
    having?: SellerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SellerProfileCountAggregateInputType | true
    _avg?: SellerProfileAvgAggregateInputType
    _sum?: SellerProfileSumAggregateInputType
    _min?: SellerProfileMinAggregateInputType
    _max?: SellerProfileMaxAggregateInputType
  }

  export type SellerProfileGroupByOutputType = {
    id: string
    userId: string
    shopName: string
    shopSlug: string
    shopDescription: string | null
    shopLogo: string | null
    shopBanner: string | null
    phone: string | null
    email: string | null
    address: string | null
    city: string | null
    postalCode: string | null
    businessLicense: string | null
    nidNumber: string | null
    tin: string | null
    status: $Enums.SellerStatus
    isVerified: boolean
    documentVerified: boolean
    rating: number | null
    ratingCount: number
    totalOrders: number
    totalRevenue: Decimal
    completionRate: number | null
    returnRate: number | null
    operatingHours: JsonValue | null
    bankDetails: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: SellerProfileCountAggregateOutputType | null
    _avg: SellerProfileAvgAggregateOutputType | null
    _sum: SellerProfileSumAggregateOutputType | null
    _min: SellerProfileMinAggregateOutputType | null
    _max: SellerProfileMaxAggregateOutputType | null
  }

  type GetSellerProfileGroupByPayload<T extends SellerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SellerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SellerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SellerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], SellerProfileGroupByOutputType[P]>
        }
      >
    >


  export type SellerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    shopName?: boolean
    shopSlug?: boolean
    shopDescription?: boolean
    shopLogo?: boolean
    shopBanner?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    city?: boolean
    postalCode?: boolean
    businessLicense?: boolean
    nidNumber?: boolean
    tin?: boolean
    status?: boolean
    isVerified?: boolean
    documentVerified?: boolean
    rating?: boolean
    ratingCount?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    completionRate?: boolean
    returnRate?: boolean
    operatingHours?: boolean
    bankDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sellerProfile"]>

  export type SellerProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    shopName?: boolean
    shopSlug?: boolean
    shopDescription?: boolean
    shopLogo?: boolean
    shopBanner?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    city?: boolean
    postalCode?: boolean
    businessLicense?: boolean
    nidNumber?: boolean
    tin?: boolean
    status?: boolean
    isVerified?: boolean
    documentVerified?: boolean
    rating?: boolean
    ratingCount?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    completionRate?: boolean
    returnRate?: boolean
    operatingHours?: boolean
    bankDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sellerProfile"]>

  export type SellerProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    shopName?: boolean
    shopSlug?: boolean
    shopDescription?: boolean
    shopLogo?: boolean
    shopBanner?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    city?: boolean
    postalCode?: boolean
    businessLicense?: boolean
    nidNumber?: boolean
    tin?: boolean
    status?: boolean
    isVerified?: boolean
    documentVerified?: boolean
    rating?: boolean
    ratingCount?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    completionRate?: boolean
    returnRate?: boolean
    operatingHours?: boolean
    bankDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sellerProfile"]>

  export type SellerProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    shopName?: boolean
    shopSlug?: boolean
    shopDescription?: boolean
    shopLogo?: boolean
    shopBanner?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    city?: boolean
    postalCode?: boolean
    businessLicense?: boolean
    nidNumber?: boolean
    tin?: boolean
    status?: boolean
    isVerified?: boolean
    documentVerified?: boolean
    rating?: boolean
    ratingCount?: boolean
    totalOrders?: boolean
    totalRevenue?: boolean
    completionRate?: boolean
    returnRate?: boolean
    operatingHours?: boolean
    bankDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SellerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "shopName" | "shopSlug" | "shopDescription" | "shopLogo" | "shopBanner" | "phone" | "email" | "address" | "city" | "postalCode" | "businessLicense" | "nidNumber" | "tin" | "status" | "isVerified" | "documentVerified" | "rating" | "ratingCount" | "totalOrders" | "totalRevenue" | "completionRate" | "returnRate" | "operatingHours" | "bankDetails" | "createdAt" | "updatedAt", ExtArgs["result"]["sellerProfile"]>

  export type $SellerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SellerProfile"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      shopName: string
      shopSlug: string
      shopDescription: string | null
      shopLogo: string | null
      shopBanner: string | null
      phone: string | null
      email: string | null
      address: string | null
      city: string | null
      postalCode: string | null
      businessLicense: string | null
      nidNumber: string | null
      tin: string | null
      status: $Enums.SellerStatus
      isVerified: boolean
      documentVerified: boolean
      rating: number | null
      ratingCount: number
      totalOrders: number
      totalRevenue: Prisma.Decimal
      completionRate: number | null
      returnRate: number | null
      operatingHours: Prisma.JsonValue | null
      bankDetails: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sellerProfile"]>
    composites: {}
  }

  type SellerProfileGetPayload<S extends boolean | null | undefined | SellerProfileDefaultArgs> = $Result.GetResult<Prisma.$SellerProfilePayload, S>

  type SellerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SellerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SellerProfileCountAggregateInputType | true
    }

  export interface SellerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SellerProfile'], meta: { name: 'SellerProfile' } }
    /**
     * Find zero or one SellerProfile that matches the filter.
     * @param {SellerProfileFindUniqueArgs} args - Arguments to find a SellerProfile
     * @example
     * // Get one SellerProfile
     * const sellerProfile = await prisma.sellerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SellerProfileFindUniqueArgs>(args: SelectSubset<T, SellerProfileFindUniqueArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SellerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SellerProfileFindUniqueOrThrowArgs} args - Arguments to find a SellerProfile
     * @example
     * // Get one SellerProfile
     * const sellerProfile = await prisma.sellerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SellerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, SellerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SellerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileFindFirstArgs} args - Arguments to find a SellerProfile
     * @example
     * // Get one SellerProfile
     * const sellerProfile = await prisma.sellerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SellerProfileFindFirstArgs>(args?: SelectSubset<T, SellerProfileFindFirstArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SellerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileFindFirstOrThrowArgs} args - Arguments to find a SellerProfile
     * @example
     * // Get one SellerProfile
     * const sellerProfile = await prisma.sellerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SellerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, SellerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SellerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SellerProfiles
     * const sellerProfiles = await prisma.sellerProfile.findMany()
     * 
     * // Get first 10 SellerProfiles
     * const sellerProfiles = await prisma.sellerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sellerProfileWithIdOnly = await prisma.sellerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SellerProfileFindManyArgs>(args?: SelectSubset<T, SellerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SellerProfile.
     * @param {SellerProfileCreateArgs} args - Arguments to create a SellerProfile.
     * @example
     * // Create one SellerProfile
     * const SellerProfile = await prisma.sellerProfile.create({
     *   data: {
     *     // ... data to create a SellerProfile
     *   }
     * })
     * 
     */
    create<T extends SellerProfileCreateArgs>(args: SelectSubset<T, SellerProfileCreateArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SellerProfiles.
     * @param {SellerProfileCreateManyArgs} args - Arguments to create many SellerProfiles.
     * @example
     * // Create many SellerProfiles
     * const sellerProfile = await prisma.sellerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SellerProfileCreateManyArgs>(args?: SelectSubset<T, SellerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SellerProfiles and returns the data saved in the database.
     * @param {SellerProfileCreateManyAndReturnArgs} args - Arguments to create many SellerProfiles.
     * @example
     * // Create many SellerProfiles
     * const sellerProfile = await prisma.sellerProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SellerProfiles and only return the `id`
     * const sellerProfileWithIdOnly = await prisma.sellerProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SellerProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, SellerProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SellerProfile.
     * @param {SellerProfileDeleteArgs} args - Arguments to delete one SellerProfile.
     * @example
     * // Delete one SellerProfile
     * const SellerProfile = await prisma.sellerProfile.delete({
     *   where: {
     *     // ... filter to delete one SellerProfile
     *   }
     * })
     * 
     */
    delete<T extends SellerProfileDeleteArgs>(args: SelectSubset<T, SellerProfileDeleteArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SellerProfile.
     * @param {SellerProfileUpdateArgs} args - Arguments to update one SellerProfile.
     * @example
     * // Update one SellerProfile
     * const sellerProfile = await prisma.sellerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SellerProfileUpdateArgs>(args: SelectSubset<T, SellerProfileUpdateArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SellerProfiles.
     * @param {SellerProfileDeleteManyArgs} args - Arguments to filter SellerProfiles to delete.
     * @example
     * // Delete a few SellerProfiles
     * const { count } = await prisma.sellerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SellerProfileDeleteManyArgs>(args?: SelectSubset<T, SellerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SellerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SellerProfiles
     * const sellerProfile = await prisma.sellerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SellerProfileUpdateManyArgs>(args: SelectSubset<T, SellerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SellerProfiles and returns the data updated in the database.
     * @param {SellerProfileUpdateManyAndReturnArgs} args - Arguments to update many SellerProfiles.
     * @example
     * // Update many SellerProfiles
     * const sellerProfile = await prisma.sellerProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SellerProfiles and only return the `id`
     * const sellerProfileWithIdOnly = await prisma.sellerProfile.updateManyAndReturn({
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
    updateManyAndReturn<T extends SellerProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, SellerProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SellerProfile.
     * @param {SellerProfileUpsertArgs} args - Arguments to update or create a SellerProfile.
     * @example
     * // Update or create a SellerProfile
     * const sellerProfile = await prisma.sellerProfile.upsert({
     *   create: {
     *     // ... data to create a SellerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SellerProfile we want to update
     *   }
     * })
     */
    upsert<T extends SellerProfileUpsertArgs>(args: SelectSubset<T, SellerProfileUpsertArgs<ExtArgs>>): Prisma__SellerProfileClient<$Result.GetResult<Prisma.$SellerProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SellerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileCountArgs} args - Arguments to filter SellerProfiles to count.
     * @example
     * // Count the number of SellerProfiles
     * const count = await prisma.sellerProfile.count({
     *   where: {
     *     // ... the filter for the SellerProfiles we want to count
     *   }
     * })
    **/
    count<T extends SellerProfileCountArgs>(
      args?: Subset<T, SellerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SellerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SellerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SellerProfileAggregateArgs>(args: Subset<T, SellerProfileAggregateArgs>): Prisma.PrismaPromise<GetSellerProfileAggregateType<T>>

    /**
     * Group by SellerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SellerProfileGroupByArgs} args - Group by arguments.
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
      T extends SellerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SellerProfileGroupByArgs['orderBy'] }
        : { orderBy?: SellerProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SellerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSellerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SellerProfile model
   */
  readonly fields: SellerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SellerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SellerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SellerProfile model
   */
  interface SellerProfileFieldRefs {
    readonly id: FieldRef<"SellerProfile", 'String'>
    readonly userId: FieldRef<"SellerProfile", 'String'>
    readonly shopName: FieldRef<"SellerProfile", 'String'>
    readonly shopSlug: FieldRef<"SellerProfile", 'String'>
    readonly shopDescription: FieldRef<"SellerProfile", 'String'>
    readonly shopLogo: FieldRef<"SellerProfile", 'String'>
    readonly shopBanner: FieldRef<"SellerProfile", 'String'>
    readonly phone: FieldRef<"SellerProfile", 'String'>
    readonly email: FieldRef<"SellerProfile", 'String'>
    readonly address: FieldRef<"SellerProfile", 'String'>
    readonly city: FieldRef<"SellerProfile", 'String'>
    readonly postalCode: FieldRef<"SellerProfile", 'String'>
    readonly businessLicense: FieldRef<"SellerProfile", 'String'>
    readonly nidNumber: FieldRef<"SellerProfile", 'String'>
    readonly tin: FieldRef<"SellerProfile", 'String'>
    readonly status: FieldRef<"SellerProfile", 'SellerStatus'>
    readonly isVerified: FieldRef<"SellerProfile", 'Boolean'>
    readonly documentVerified: FieldRef<"SellerProfile", 'Boolean'>
    readonly rating: FieldRef<"SellerProfile", 'Float'>
    readonly ratingCount: FieldRef<"SellerProfile", 'Int'>
    readonly totalOrders: FieldRef<"SellerProfile", 'Int'>
    readonly totalRevenue: FieldRef<"SellerProfile", 'Decimal'>
    readonly completionRate: FieldRef<"SellerProfile", 'Float'>
    readonly returnRate: FieldRef<"SellerProfile", 'Float'>
    readonly operatingHours: FieldRef<"SellerProfile", 'Json'>
    readonly bankDetails: FieldRef<"SellerProfile", 'Json'>
    readonly createdAt: FieldRef<"SellerProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"SellerProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SellerProfile findUnique
   */
  export type SellerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * Filter, which SellerProfile to fetch.
     */
    where: SellerProfileWhereUniqueInput
  }

  /**
   * SellerProfile findUniqueOrThrow
   */
  export type SellerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * Filter, which SellerProfile to fetch.
     */
    where: SellerProfileWhereUniqueInput
  }

  /**
   * SellerProfile findFirst
   */
  export type SellerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * Filter, which SellerProfile to fetch.
     */
    where?: SellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProfiles to fetch.
     */
    orderBy?: SellerProfileOrderByWithRelationInput | SellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SellerProfiles.
     */
    cursor?: SellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerProfiles.
     */
    distinct?: SellerProfileScalarFieldEnum | SellerProfileScalarFieldEnum[]
  }

  /**
   * SellerProfile findFirstOrThrow
   */
  export type SellerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * Filter, which SellerProfile to fetch.
     */
    where?: SellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProfiles to fetch.
     */
    orderBy?: SellerProfileOrderByWithRelationInput | SellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SellerProfiles.
     */
    cursor?: SellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerProfiles.
     */
    distinct?: SellerProfileScalarFieldEnum | SellerProfileScalarFieldEnum[]
  }

  /**
   * SellerProfile findMany
   */
  export type SellerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * Filter, which SellerProfiles to fetch.
     */
    where?: SellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SellerProfiles to fetch.
     */
    orderBy?: SellerProfileOrderByWithRelationInput | SellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SellerProfiles.
     */
    cursor?: SellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SellerProfiles.
     */
    distinct?: SellerProfileScalarFieldEnum | SellerProfileScalarFieldEnum[]
  }

  /**
   * SellerProfile create
   */
  export type SellerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * The data needed to create a SellerProfile.
     */
    data: XOR<SellerProfileCreateInput, SellerProfileUncheckedCreateInput>
  }

  /**
   * SellerProfile createMany
   */
  export type SellerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SellerProfiles.
     */
    data: SellerProfileCreateManyInput | SellerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SellerProfile createManyAndReturn
   */
  export type SellerProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * The data used to create many SellerProfiles.
     */
    data: SellerProfileCreateManyInput | SellerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SellerProfile update
   */
  export type SellerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * The data needed to update a SellerProfile.
     */
    data: XOR<SellerProfileUpdateInput, SellerProfileUncheckedUpdateInput>
    /**
     * Choose, which SellerProfile to update.
     */
    where: SellerProfileWhereUniqueInput
  }

  /**
   * SellerProfile updateMany
   */
  export type SellerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SellerProfiles.
     */
    data: XOR<SellerProfileUpdateManyMutationInput, SellerProfileUncheckedUpdateManyInput>
    /**
     * Filter which SellerProfiles to update
     */
    where?: SellerProfileWhereInput
    /**
     * Limit how many SellerProfiles to update.
     */
    limit?: number
  }

  /**
   * SellerProfile updateManyAndReturn
   */
  export type SellerProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * The data used to update SellerProfiles.
     */
    data: XOR<SellerProfileUpdateManyMutationInput, SellerProfileUncheckedUpdateManyInput>
    /**
     * Filter which SellerProfiles to update
     */
    where?: SellerProfileWhereInput
    /**
     * Limit how many SellerProfiles to update.
     */
    limit?: number
  }

  /**
   * SellerProfile upsert
   */
  export type SellerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * The filter to search for the SellerProfile to update in case it exists.
     */
    where: SellerProfileWhereUniqueInput
    /**
     * In case the SellerProfile found by the `where` argument doesn't exist, create a new SellerProfile with this data.
     */
    create: XOR<SellerProfileCreateInput, SellerProfileUncheckedCreateInput>
    /**
     * In case the SellerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SellerProfileUpdateInput, SellerProfileUncheckedUpdateInput>
  }

  /**
   * SellerProfile delete
   */
  export type SellerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
    /**
     * Filter which SellerProfile to delete.
     */
    where: SellerProfileWhereUniqueInput
  }

  /**
   * SellerProfile deleteMany
   */
  export type SellerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SellerProfiles to delete
     */
    where?: SellerProfileWhereInput
    /**
     * Limit how many SellerProfiles to delete.
     */
    limit?: number
  }

  /**
   * SellerProfile without action
   */
  export type SellerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SellerProfile
     */
    select?: SellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SellerProfile
     */
    omit?: SellerProfileOmit<ExtArgs> | null
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


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    avatar: 'avatar',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const AddressScalarFieldEnum: {
    id: 'id',
    userProfileId: 'userProfileId',
    label: 'label',
    fullName: 'fullName',
    phone: 'phone',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    district: 'district',
    division: 'division',
    postalCode: 'postalCode',
    country: 'country',
    isDefault: 'isDefault',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AddressScalarFieldEnum = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum]


  export const WishlistItemScalarFieldEnum: {
    id: 'id',
    userProfileId: 'userProfileId',
    productId: 'productId',
    addedAt: 'addedAt'
  };

  export type WishlistItemScalarFieldEnum = (typeof WishlistItemScalarFieldEnum)[keyof typeof WishlistItemScalarFieldEnum]


  export const RecentlyViewedScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    viewedAt: 'viewedAt'
  };

  export type RecentlyViewedScalarFieldEnum = (typeof RecentlyViewedScalarFieldEnum)[keyof typeof RecentlyViewedScalarFieldEnum]


  export const SellerProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    shopName: 'shopName',
    shopSlug: 'shopSlug',
    shopDescription: 'shopDescription',
    shopLogo: 'shopLogo',
    shopBanner: 'shopBanner',
    phone: 'phone',
    email: 'email',
    address: 'address',
    city: 'city',
    postalCode: 'postalCode',
    businessLicense: 'businessLicense',
    nidNumber: 'nidNumber',
    tin: 'tin',
    status: 'status',
    isVerified: 'isVerified',
    documentVerified: 'documentVerified',
    rating: 'rating',
    ratingCount: 'ratingCount',
    totalOrders: 'totalOrders',
    totalRevenue: 'totalRevenue',
    completionRate: 'completionRate',
    returnRate: 'returnRate',
    operatingHours: 'operatingHours',
    bankDetails: 'bankDetails',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SellerProfileScalarFieldEnum = (typeof SellerProfileScalarFieldEnum)[keyof typeof SellerProfileScalarFieldEnum]


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


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Gender'
   */
  export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender'>
    


  /**
   * Reference to a field of type 'Gender[]'
   */
  export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AddressType'
   */
  export type EnumAddressTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AddressType'>
    


  /**
   * Reference to a field of type 'AddressType[]'
   */
  export type ListEnumAddressTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AddressType[]'>
    


  /**
   * Reference to a field of type 'SellerStatus'
   */
  export type EnumSellerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SellerStatus'>
    


  /**
   * Reference to a field of type 'SellerStatus[]'
   */
  export type ListEnumSellerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SellerStatus[]'>
    


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
   * Deep Input Types
   */


  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: StringFilter<"UserProfile"> | string
    userId?: StringFilter<"UserProfile"> | string
    email?: StringNullableFilter<"UserProfile"> | string | null
    firstName?: StringNullableFilter<"UserProfile"> | string | null
    lastName?: StringNullableFilter<"UserProfile"> | string | null
    phone?: StringNullableFilter<"UserProfile"> | string | null
    avatar?: StringNullableFilter<"UserProfile"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    gender?: EnumGenderNullableFilter<"UserProfile"> | $Enums.Gender | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    addresses?: AddressListRelationFilter
    wishlist?: WishlistItemListRelationFilter
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    addresses?: AddressOrderByRelationAggregateInput
    wishlist?: WishlistItemOrderByRelationAggregateInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    email?: StringNullableFilter<"UserProfile"> | string | null
    firstName?: StringNullableFilter<"UserProfile"> | string | null
    lastName?: StringNullableFilter<"UserProfile"> | string | null
    phone?: StringNullableFilter<"UserProfile"> | string | null
    avatar?: StringNullableFilter<"UserProfile"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"UserProfile"> | Date | string | null
    gender?: EnumGenderNullableFilter<"UserProfile"> | $Enums.Gender | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    addresses?: AddressListRelationFilter
    wishlist?: WishlistItemListRelationFilter
  }, "id" | "userId">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProfile"> | string
    userId?: StringWithAggregatesFilter<"UserProfile"> | string
    email?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    phone?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"UserProfile"> | Date | string | null
    gender?: EnumGenderNullableWithAggregatesFilter<"UserProfile"> | $Enums.Gender | null
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
  }

  export type AddressWhereInput = {
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    id?: StringFilter<"Address"> | string
    userProfileId?: StringFilter<"Address"> | string
    label?: StringNullableFilter<"Address"> | string | null
    fullName?: StringFilter<"Address"> | string
    phone?: StringFilter<"Address"> | string
    addressLine1?: StringFilter<"Address"> | string
    addressLine2?: StringNullableFilter<"Address"> | string | null
    city?: StringFilter<"Address"> | string
    district?: StringNullableFilter<"Address"> | string | null
    division?: StringNullableFilter<"Address"> | string | null
    postalCode?: StringNullableFilter<"Address"> | string | null
    country?: StringFilter<"Address"> | string
    isDefault?: BoolFilter<"Address"> | boolean
    type?: EnumAddressTypeFilter<"Address"> | $Enums.AddressType
    createdAt?: DateTimeFilter<"Address"> | Date | string
    updatedAt?: DateTimeFilter<"Address"> | Date | string
    userProfile?: XOR<UserProfileScalarRelationFilter, UserProfileWhereInput>
  }

  export type AddressOrderByWithRelationInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    label?: SortOrderInput | SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrderInput | SortOrder
    city?: SortOrder
    district?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userProfile?: UserProfileOrderByWithRelationInput
  }

  export type AddressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    userProfileId?: StringFilter<"Address"> | string
    label?: StringNullableFilter<"Address"> | string | null
    fullName?: StringFilter<"Address"> | string
    phone?: StringFilter<"Address"> | string
    addressLine1?: StringFilter<"Address"> | string
    addressLine2?: StringNullableFilter<"Address"> | string | null
    city?: StringFilter<"Address"> | string
    district?: StringNullableFilter<"Address"> | string | null
    division?: StringNullableFilter<"Address"> | string | null
    postalCode?: StringNullableFilter<"Address"> | string | null
    country?: StringFilter<"Address"> | string
    isDefault?: BoolFilter<"Address"> | boolean
    type?: EnumAddressTypeFilter<"Address"> | $Enums.AddressType
    createdAt?: DateTimeFilter<"Address"> | Date | string
    updatedAt?: DateTimeFilter<"Address"> | Date | string
    userProfile?: XOR<UserProfileScalarRelationFilter, UserProfileWhereInput>
  }, "id">

  export type AddressOrderByWithAggregationInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    label?: SortOrderInput | SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrderInput | SortOrder
    city?: SortOrder
    district?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AddressCountOrderByAggregateInput
    _max?: AddressMaxOrderByAggregateInput
    _min?: AddressMinOrderByAggregateInput
  }

  export type AddressScalarWhereWithAggregatesInput = {
    AND?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    OR?: AddressScalarWhereWithAggregatesInput[]
    NOT?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Address"> | string
    userProfileId?: StringWithAggregatesFilter<"Address"> | string
    label?: StringNullableWithAggregatesFilter<"Address"> | string | null
    fullName?: StringWithAggregatesFilter<"Address"> | string
    phone?: StringWithAggregatesFilter<"Address"> | string
    addressLine1?: StringWithAggregatesFilter<"Address"> | string
    addressLine2?: StringNullableWithAggregatesFilter<"Address"> | string | null
    city?: StringWithAggregatesFilter<"Address"> | string
    district?: StringNullableWithAggregatesFilter<"Address"> | string | null
    division?: StringNullableWithAggregatesFilter<"Address"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"Address"> | string | null
    country?: StringWithAggregatesFilter<"Address"> | string
    isDefault?: BoolWithAggregatesFilter<"Address"> | boolean
    type?: EnumAddressTypeWithAggregatesFilter<"Address"> | $Enums.AddressType
    createdAt?: DateTimeWithAggregatesFilter<"Address"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Address"> | Date | string
  }

  export type WishlistItemWhereInput = {
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[]
    OR?: WishlistItemWhereInput[]
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[]
    id?: StringFilter<"WishlistItem"> | string
    userProfileId?: StringFilter<"WishlistItem"> | string
    productId?: StringFilter<"WishlistItem"> | string
    addedAt?: DateTimeFilter<"WishlistItem"> | Date | string
    userProfile?: XOR<UserProfileScalarRelationFilter, UserProfileWhereInput>
  }

  export type WishlistItemOrderByWithRelationInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    productId?: SortOrder
    addedAt?: SortOrder
    userProfile?: UserProfileOrderByWithRelationInput
  }

  export type WishlistItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userProfileId_productId?: WishlistItemUserProfileIdProductIdCompoundUniqueInput
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[]
    OR?: WishlistItemWhereInput[]
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[]
    userProfileId?: StringFilter<"WishlistItem"> | string
    productId?: StringFilter<"WishlistItem"> | string
    addedAt?: DateTimeFilter<"WishlistItem"> | Date | string
    userProfile?: XOR<UserProfileScalarRelationFilter, UserProfileWhereInput>
  }, "id" | "userProfileId_productId">

  export type WishlistItemOrderByWithAggregationInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    productId?: SortOrder
    addedAt?: SortOrder
    _count?: WishlistItemCountOrderByAggregateInput
    _max?: WishlistItemMaxOrderByAggregateInput
    _min?: WishlistItemMinOrderByAggregateInput
  }

  export type WishlistItemScalarWhereWithAggregatesInput = {
    AND?: WishlistItemScalarWhereWithAggregatesInput | WishlistItemScalarWhereWithAggregatesInput[]
    OR?: WishlistItemScalarWhereWithAggregatesInput[]
    NOT?: WishlistItemScalarWhereWithAggregatesInput | WishlistItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WishlistItem"> | string
    userProfileId?: StringWithAggregatesFilter<"WishlistItem"> | string
    productId?: StringWithAggregatesFilter<"WishlistItem"> | string
    addedAt?: DateTimeWithAggregatesFilter<"WishlistItem"> | Date | string
  }

  export type RecentlyViewedWhereInput = {
    AND?: RecentlyViewedWhereInput | RecentlyViewedWhereInput[]
    OR?: RecentlyViewedWhereInput[]
    NOT?: RecentlyViewedWhereInput | RecentlyViewedWhereInput[]
    id?: StringFilter<"RecentlyViewed"> | string
    userId?: StringFilter<"RecentlyViewed"> | string
    productId?: StringFilter<"RecentlyViewed"> | string
    viewedAt?: DateTimeFilter<"RecentlyViewed"> | Date | string
  }

  export type RecentlyViewedOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    viewedAt?: SortOrder
  }

  export type RecentlyViewedWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_productId?: RecentlyViewedUserIdProductIdCompoundUniqueInput
    AND?: RecentlyViewedWhereInput | RecentlyViewedWhereInput[]
    OR?: RecentlyViewedWhereInput[]
    NOT?: RecentlyViewedWhereInput | RecentlyViewedWhereInput[]
    userId?: StringFilter<"RecentlyViewed"> | string
    productId?: StringFilter<"RecentlyViewed"> | string
    viewedAt?: DateTimeFilter<"RecentlyViewed"> | Date | string
  }, "id" | "userId_productId">

  export type RecentlyViewedOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    viewedAt?: SortOrder
    _count?: RecentlyViewedCountOrderByAggregateInput
    _max?: RecentlyViewedMaxOrderByAggregateInput
    _min?: RecentlyViewedMinOrderByAggregateInput
  }

  export type RecentlyViewedScalarWhereWithAggregatesInput = {
    AND?: RecentlyViewedScalarWhereWithAggregatesInput | RecentlyViewedScalarWhereWithAggregatesInput[]
    OR?: RecentlyViewedScalarWhereWithAggregatesInput[]
    NOT?: RecentlyViewedScalarWhereWithAggregatesInput | RecentlyViewedScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RecentlyViewed"> | string
    userId?: StringWithAggregatesFilter<"RecentlyViewed"> | string
    productId?: StringWithAggregatesFilter<"RecentlyViewed"> | string
    viewedAt?: DateTimeWithAggregatesFilter<"RecentlyViewed"> | Date | string
  }

  export type SellerProfileWhereInput = {
    AND?: SellerProfileWhereInput | SellerProfileWhereInput[]
    OR?: SellerProfileWhereInput[]
    NOT?: SellerProfileWhereInput | SellerProfileWhereInput[]
    id?: StringFilter<"SellerProfile"> | string
    userId?: StringFilter<"SellerProfile"> | string
    shopName?: StringFilter<"SellerProfile"> | string
    shopSlug?: StringFilter<"SellerProfile"> | string
    shopDescription?: StringNullableFilter<"SellerProfile"> | string | null
    shopLogo?: StringNullableFilter<"SellerProfile"> | string | null
    shopBanner?: StringNullableFilter<"SellerProfile"> | string | null
    phone?: StringNullableFilter<"SellerProfile"> | string | null
    email?: StringNullableFilter<"SellerProfile"> | string | null
    address?: StringNullableFilter<"SellerProfile"> | string | null
    city?: StringNullableFilter<"SellerProfile"> | string | null
    postalCode?: StringNullableFilter<"SellerProfile"> | string | null
    businessLicense?: StringNullableFilter<"SellerProfile"> | string | null
    nidNumber?: StringNullableFilter<"SellerProfile"> | string | null
    tin?: StringNullableFilter<"SellerProfile"> | string | null
    status?: EnumSellerStatusFilter<"SellerProfile"> | $Enums.SellerStatus
    isVerified?: BoolFilter<"SellerProfile"> | boolean
    documentVerified?: BoolFilter<"SellerProfile"> | boolean
    rating?: FloatNullableFilter<"SellerProfile"> | number | null
    ratingCount?: IntFilter<"SellerProfile"> | number
    totalOrders?: IntFilter<"SellerProfile"> | number
    totalRevenue?: DecimalFilter<"SellerProfile"> | Decimal | DecimalJsLike | number | string
    completionRate?: FloatNullableFilter<"SellerProfile"> | number | null
    returnRate?: FloatNullableFilter<"SellerProfile"> | number | null
    operatingHours?: JsonNullableFilter<"SellerProfile">
    bankDetails?: JsonNullableFilter<"SellerProfile">
    createdAt?: DateTimeFilter<"SellerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"SellerProfile"> | Date | string
  }

  export type SellerProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    shopName?: SortOrder
    shopSlug?: SortOrder
    shopDescription?: SortOrderInput | SortOrder
    shopLogo?: SortOrderInput | SortOrder
    shopBanner?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    businessLicense?: SortOrderInput | SortOrder
    nidNumber?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    status?: SortOrder
    isVerified?: SortOrder
    documentVerified?: SortOrder
    rating?: SortOrderInput | SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrderInput | SortOrder
    returnRate?: SortOrderInput | SortOrder
    operatingHours?: SortOrderInput | SortOrder
    bankDetails?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    shopSlug?: string
    AND?: SellerProfileWhereInput | SellerProfileWhereInput[]
    OR?: SellerProfileWhereInput[]
    NOT?: SellerProfileWhereInput | SellerProfileWhereInput[]
    shopName?: StringFilter<"SellerProfile"> | string
    shopDescription?: StringNullableFilter<"SellerProfile"> | string | null
    shopLogo?: StringNullableFilter<"SellerProfile"> | string | null
    shopBanner?: StringNullableFilter<"SellerProfile"> | string | null
    phone?: StringNullableFilter<"SellerProfile"> | string | null
    email?: StringNullableFilter<"SellerProfile"> | string | null
    address?: StringNullableFilter<"SellerProfile"> | string | null
    city?: StringNullableFilter<"SellerProfile"> | string | null
    postalCode?: StringNullableFilter<"SellerProfile"> | string | null
    businessLicense?: StringNullableFilter<"SellerProfile"> | string | null
    nidNumber?: StringNullableFilter<"SellerProfile"> | string | null
    tin?: StringNullableFilter<"SellerProfile"> | string | null
    status?: EnumSellerStatusFilter<"SellerProfile"> | $Enums.SellerStatus
    isVerified?: BoolFilter<"SellerProfile"> | boolean
    documentVerified?: BoolFilter<"SellerProfile"> | boolean
    rating?: FloatNullableFilter<"SellerProfile"> | number | null
    ratingCount?: IntFilter<"SellerProfile"> | number
    totalOrders?: IntFilter<"SellerProfile"> | number
    totalRevenue?: DecimalFilter<"SellerProfile"> | Decimal | DecimalJsLike | number | string
    completionRate?: FloatNullableFilter<"SellerProfile"> | number | null
    returnRate?: FloatNullableFilter<"SellerProfile"> | number | null
    operatingHours?: JsonNullableFilter<"SellerProfile">
    bankDetails?: JsonNullableFilter<"SellerProfile">
    createdAt?: DateTimeFilter<"SellerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"SellerProfile"> | Date | string
  }, "id" | "userId" | "shopSlug">

  export type SellerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    shopName?: SortOrder
    shopSlug?: SortOrder
    shopDescription?: SortOrderInput | SortOrder
    shopLogo?: SortOrderInput | SortOrder
    shopBanner?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    businessLicense?: SortOrderInput | SortOrder
    nidNumber?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    status?: SortOrder
    isVerified?: SortOrder
    documentVerified?: SortOrder
    rating?: SortOrderInput | SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrderInput | SortOrder
    returnRate?: SortOrderInput | SortOrder
    operatingHours?: SortOrderInput | SortOrder
    bankDetails?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SellerProfileCountOrderByAggregateInput
    _avg?: SellerProfileAvgOrderByAggregateInput
    _max?: SellerProfileMaxOrderByAggregateInput
    _min?: SellerProfileMinOrderByAggregateInput
    _sum?: SellerProfileSumOrderByAggregateInput
  }

  export type SellerProfileScalarWhereWithAggregatesInput = {
    AND?: SellerProfileScalarWhereWithAggregatesInput | SellerProfileScalarWhereWithAggregatesInput[]
    OR?: SellerProfileScalarWhereWithAggregatesInput[]
    NOT?: SellerProfileScalarWhereWithAggregatesInput | SellerProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SellerProfile"> | string
    userId?: StringWithAggregatesFilter<"SellerProfile"> | string
    shopName?: StringWithAggregatesFilter<"SellerProfile"> | string
    shopSlug?: StringWithAggregatesFilter<"SellerProfile"> | string
    shopDescription?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    shopLogo?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    shopBanner?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    phone?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    email?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    address?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    city?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    businessLicense?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    nidNumber?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    tin?: StringNullableWithAggregatesFilter<"SellerProfile"> | string | null
    status?: EnumSellerStatusWithAggregatesFilter<"SellerProfile"> | $Enums.SellerStatus
    isVerified?: BoolWithAggregatesFilter<"SellerProfile"> | boolean
    documentVerified?: BoolWithAggregatesFilter<"SellerProfile"> | boolean
    rating?: FloatNullableWithAggregatesFilter<"SellerProfile"> | number | null
    ratingCount?: IntWithAggregatesFilter<"SellerProfile"> | number
    totalOrders?: IntWithAggregatesFilter<"SellerProfile"> | number
    totalRevenue?: DecimalWithAggregatesFilter<"SellerProfile"> | Decimal | DecimalJsLike | number | string
    completionRate?: FloatNullableWithAggregatesFilter<"SellerProfile"> | number | null
    returnRate?: FloatNullableWithAggregatesFilter<"SellerProfile"> | number | null
    operatingHours?: JsonNullableWithAggregatesFilter<"SellerProfile">
    bankDetails?: JsonNullableWithAggregatesFilter<"SellerProfile">
    createdAt?: DateTimeWithAggregatesFilter<"SellerProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SellerProfile"> | Date | string
  }

  export type UserProfileCreateInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
    addresses?: AddressCreateNestedManyWithoutUserProfileInput
    wishlist?: WishlistItemCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
    addresses?: AddressUncheckedCreateNestedManyWithoutUserProfileInput
    wishlist?: WishlistItemUncheckedCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    addresses?: AddressUpdateManyWithoutUserProfileNestedInput
    wishlist?: WishlistItemUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    addresses?: AddressUncheckedUpdateManyWithoutUserProfileNestedInput
    wishlist?: WishlistItemUncheckedUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileCreateManyInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressCreateInput = {
    id?: string
    label?: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    district?: string | null
    division?: string | null
    postalCode?: string | null
    country?: string
    isDefault?: boolean
    type?: $Enums.AddressType
    createdAt?: Date | string
    updatedAt?: Date | string
    userProfile: UserProfileCreateNestedOneWithoutAddressesInput
  }

  export type AddressUncheckedCreateInput = {
    id?: string
    userProfileId: string
    label?: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    district?: string | null
    division?: string | null
    postalCode?: string | null
    country?: string
    isDefault?: boolean
    type?: $Enums.AddressType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneRequiredWithoutAddressesNestedInput
  }

  export type AddressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userProfileId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressCreateManyInput = {
    id?: string
    userProfileId: string
    label?: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    district?: string | null
    division?: string | null
    postalCode?: string | null
    country?: string
    isDefault?: boolean
    type?: $Enums.AddressType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userProfileId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemCreateInput = {
    id?: string
    productId: string
    addedAt?: Date | string
    userProfile: UserProfileCreateNestedOneWithoutWishlistInput
  }

  export type WishlistItemUncheckedCreateInput = {
    id?: string
    userProfileId: string
    productId: string
    addedAt?: Date | string
  }

  export type WishlistItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProfile?: UserProfileUpdateOneRequiredWithoutWishlistNestedInput
  }

  export type WishlistItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userProfileId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemCreateManyInput = {
    id?: string
    userProfileId: string
    productId: string
    addedAt?: Date | string
  }

  export type WishlistItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userProfileId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentlyViewedCreateInput = {
    id?: string
    userId: string
    productId: string
    viewedAt?: Date | string
  }

  export type RecentlyViewedUncheckedCreateInput = {
    id?: string
    userId: string
    productId: string
    viewedAt?: Date | string
  }

  export type RecentlyViewedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentlyViewedUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentlyViewedCreateManyInput = {
    id?: string
    userId: string
    productId: string
    viewedAt?: Date | string
  }

  export type RecentlyViewedUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentlyViewedUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProfileCreateInput = {
    id?: string
    userId: string
    shopName: string
    shopSlug: string
    shopDescription?: string | null
    shopLogo?: string | null
    shopBanner?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    city?: string | null
    postalCode?: string | null
    businessLicense?: string | null
    nidNumber?: string | null
    tin?: string | null
    status?: $Enums.SellerStatus
    isVerified?: boolean
    documentVerified?: boolean
    rating?: number | null
    ratingCount?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    completionRate?: number | null
    returnRate?: number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProfileUncheckedCreateInput = {
    id?: string
    userId: string
    shopName: string
    shopSlug: string
    shopDescription?: string | null
    shopLogo?: string | null
    shopBanner?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    city?: string | null
    postalCode?: string | null
    businessLicense?: string | null
    nidNumber?: string | null
    tin?: string | null
    status?: $Enums.SellerStatus
    isVerified?: boolean
    documentVerified?: boolean
    rating?: number | null
    ratingCount?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    completionRate?: number | null
    returnRate?: number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    shopName?: StringFieldUpdateOperationsInput | string
    shopSlug?: StringFieldUpdateOperationsInput | string
    shopDescription?: NullableStringFieldUpdateOperationsInput | string | null
    shopLogo?: NullableStringFieldUpdateOperationsInput | string | null
    shopBanner?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessLicense?: NullableStringFieldUpdateOperationsInput | string | null
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSellerStatusFieldUpdateOperationsInput | $Enums.SellerStatus
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    documentVerified?: BoolFieldUpdateOperationsInput | boolean
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingCount?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completionRate?: NullableFloatFieldUpdateOperationsInput | number | null
    returnRate?: NullableFloatFieldUpdateOperationsInput | number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    shopName?: StringFieldUpdateOperationsInput | string
    shopSlug?: StringFieldUpdateOperationsInput | string
    shopDescription?: NullableStringFieldUpdateOperationsInput | string | null
    shopLogo?: NullableStringFieldUpdateOperationsInput | string | null
    shopBanner?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessLicense?: NullableStringFieldUpdateOperationsInput | string | null
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSellerStatusFieldUpdateOperationsInput | $Enums.SellerStatus
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    documentVerified?: BoolFieldUpdateOperationsInput | boolean
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingCount?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completionRate?: NullableFloatFieldUpdateOperationsInput | number | null
    returnRate?: NullableFloatFieldUpdateOperationsInput | number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProfileCreateManyInput = {
    id?: string
    userId: string
    shopName: string
    shopSlug: string
    shopDescription?: string | null
    shopLogo?: string | null
    shopBanner?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    city?: string | null
    postalCode?: string | null
    businessLicense?: string | null
    nidNumber?: string | null
    tin?: string | null
    status?: $Enums.SellerStatus
    isVerified?: boolean
    documentVerified?: boolean
    rating?: number | null
    ratingCount?: number
    totalOrders?: number
    totalRevenue?: Decimal | DecimalJsLike | number | string
    completionRate?: number | null
    returnRate?: number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SellerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    shopName?: StringFieldUpdateOperationsInput | string
    shopSlug?: StringFieldUpdateOperationsInput | string
    shopDescription?: NullableStringFieldUpdateOperationsInput | string | null
    shopLogo?: NullableStringFieldUpdateOperationsInput | string | null
    shopBanner?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessLicense?: NullableStringFieldUpdateOperationsInput | string | null
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSellerStatusFieldUpdateOperationsInput | $Enums.SellerStatus
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    documentVerified?: BoolFieldUpdateOperationsInput | boolean
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingCount?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completionRate?: NullableFloatFieldUpdateOperationsInput | number | null
    returnRate?: NullableFloatFieldUpdateOperationsInput | number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SellerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    shopName?: StringFieldUpdateOperationsInput | string
    shopSlug?: StringFieldUpdateOperationsInput | string
    shopDescription?: NullableStringFieldUpdateOperationsInput | string | null
    shopLogo?: NullableStringFieldUpdateOperationsInput | string | null
    shopBanner?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    businessLicense?: NullableStringFieldUpdateOperationsInput | string | null
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSellerStatusFieldUpdateOperationsInput | $Enums.SellerStatus
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    documentVerified?: BoolFieldUpdateOperationsInput | boolean
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    ratingCount?: IntFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalRevenue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    completionRate?: NullableFloatFieldUpdateOperationsInput | number | null
    returnRate?: NullableFloatFieldUpdateOperationsInput | number | null
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    bankDetails?: NullableJsonNullValueInput | InputJsonValue
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

  export type EnumGenderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableFilter<$PrismaModel> | $Enums.Gender | null
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

  export type AddressListRelationFilter = {
    every?: AddressWhereInput
    some?: AddressWhereInput
    none?: AddressWhereInput
  }

  export type WishlistItemListRelationFilter = {
    every?: WishlistItemWhereInput
    some?: WishlistItemWhereInput
    none?: WishlistItemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AddressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WishlistItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type EnumGenderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableWithAggregatesFilter<$PrismaModel> | $Enums.Gender | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGenderNullableFilter<$PrismaModel>
    _max?: NestedEnumGenderNullableFilter<$PrismaModel>
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumAddressTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AddressType | EnumAddressTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAddressTypeFilter<$PrismaModel> | $Enums.AddressType
  }

  export type UserProfileScalarRelationFilter = {
    is?: UserProfileWhereInput
    isNot?: UserProfileWhereInput
  }

  export type AddressCountOrderByAggregateInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    label?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    district?: SortOrder
    division?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AddressMaxOrderByAggregateInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    label?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    district?: SortOrder
    division?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AddressMinOrderByAggregateInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    label?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    district?: SortOrder
    division?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    isDefault?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAddressTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AddressType | EnumAddressTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAddressTypeWithAggregatesFilter<$PrismaModel> | $Enums.AddressType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAddressTypeFilter<$PrismaModel>
    _max?: NestedEnumAddressTypeFilter<$PrismaModel>
  }

  export type WishlistItemUserProfileIdProductIdCompoundUniqueInput = {
    userProfileId: string
    productId: string
  }

  export type WishlistItemCountOrderByAggregateInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    productId?: SortOrder
    addedAt?: SortOrder
  }

  export type WishlistItemMaxOrderByAggregateInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    productId?: SortOrder
    addedAt?: SortOrder
  }

  export type WishlistItemMinOrderByAggregateInput = {
    id?: SortOrder
    userProfileId?: SortOrder
    productId?: SortOrder
    addedAt?: SortOrder
  }

  export type RecentlyViewedUserIdProductIdCompoundUniqueInput = {
    userId: string
    productId: string
  }

  export type RecentlyViewedCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    viewedAt?: SortOrder
  }

  export type RecentlyViewedMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    viewedAt?: SortOrder
  }

  export type RecentlyViewedMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    viewedAt?: SortOrder
  }

  export type EnumSellerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SellerStatus | EnumSellerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSellerStatusFilter<$PrismaModel> | $Enums.SellerStatus
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type SellerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    shopName?: SortOrder
    shopSlug?: SortOrder
    shopDescription?: SortOrder
    shopLogo?: SortOrder
    shopBanner?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    businessLicense?: SortOrder
    nidNumber?: SortOrder
    tin?: SortOrder
    status?: SortOrder
    isVerified?: SortOrder
    documentVerified?: SortOrder
    rating?: SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrder
    returnRate?: SortOrder
    operatingHours?: SortOrder
    bankDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProfileAvgOrderByAggregateInput = {
    rating?: SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrder
    returnRate?: SortOrder
  }

  export type SellerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    shopName?: SortOrder
    shopSlug?: SortOrder
    shopDescription?: SortOrder
    shopLogo?: SortOrder
    shopBanner?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    businessLicense?: SortOrder
    nidNumber?: SortOrder
    tin?: SortOrder
    status?: SortOrder
    isVerified?: SortOrder
    documentVerified?: SortOrder
    rating?: SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrder
    returnRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    shopName?: SortOrder
    shopSlug?: SortOrder
    shopDescription?: SortOrder
    shopLogo?: SortOrder
    shopBanner?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    businessLicense?: SortOrder
    nidNumber?: SortOrder
    tin?: SortOrder
    status?: SortOrder
    isVerified?: SortOrder
    documentVerified?: SortOrder
    rating?: SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrder
    returnRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SellerProfileSumOrderByAggregateInput = {
    rating?: SortOrder
    ratingCount?: SortOrder
    totalOrders?: SortOrder
    totalRevenue?: SortOrder
    completionRate?: SortOrder
    returnRate?: SortOrder
  }

  export type EnumSellerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SellerStatus | EnumSellerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSellerStatusWithAggregatesFilter<$PrismaModel> | $Enums.SellerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSellerStatusFilter<$PrismaModel>
    _max?: NestedEnumSellerStatusFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type AddressCreateNestedManyWithoutUserProfileInput = {
    create?: XOR<AddressCreateWithoutUserProfileInput, AddressUncheckedCreateWithoutUserProfileInput> | AddressCreateWithoutUserProfileInput[] | AddressUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserProfileInput | AddressCreateOrConnectWithoutUserProfileInput[]
    createMany?: AddressCreateManyUserProfileInputEnvelope
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
  }

  export type WishlistItemCreateNestedManyWithoutUserProfileInput = {
    create?: XOR<WishlistItemCreateWithoutUserProfileInput, WishlistItemUncheckedCreateWithoutUserProfileInput> | WishlistItemCreateWithoutUserProfileInput[] | WishlistItemUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: WishlistItemCreateOrConnectWithoutUserProfileInput | WishlistItemCreateOrConnectWithoutUserProfileInput[]
    createMany?: WishlistItemCreateManyUserProfileInputEnvelope
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
  }

  export type AddressUncheckedCreateNestedManyWithoutUserProfileInput = {
    create?: XOR<AddressCreateWithoutUserProfileInput, AddressUncheckedCreateWithoutUserProfileInput> | AddressCreateWithoutUserProfileInput[] | AddressUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserProfileInput | AddressCreateOrConnectWithoutUserProfileInput[]
    createMany?: AddressCreateManyUserProfileInputEnvelope
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
  }

  export type WishlistItemUncheckedCreateNestedManyWithoutUserProfileInput = {
    create?: XOR<WishlistItemCreateWithoutUserProfileInput, WishlistItemUncheckedCreateWithoutUserProfileInput> | WishlistItemCreateWithoutUserProfileInput[] | WishlistItemUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: WishlistItemCreateOrConnectWithoutUserProfileInput | WishlistItemCreateOrConnectWithoutUserProfileInput[]
    createMany?: WishlistItemCreateManyUserProfileInputEnvelope
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableEnumGenderFieldUpdateOperationsInput = {
    set?: $Enums.Gender | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AddressUpdateManyWithoutUserProfileNestedInput = {
    create?: XOR<AddressCreateWithoutUserProfileInput, AddressUncheckedCreateWithoutUserProfileInput> | AddressCreateWithoutUserProfileInput[] | AddressUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserProfileInput | AddressCreateOrConnectWithoutUserProfileInput[]
    upsert?: AddressUpsertWithWhereUniqueWithoutUserProfileInput | AddressUpsertWithWhereUniqueWithoutUserProfileInput[]
    createMany?: AddressCreateManyUserProfileInputEnvelope
    set?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    disconnect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    delete?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    update?: AddressUpdateWithWhereUniqueWithoutUserProfileInput | AddressUpdateWithWhereUniqueWithoutUserProfileInput[]
    updateMany?: AddressUpdateManyWithWhereWithoutUserProfileInput | AddressUpdateManyWithWhereWithoutUserProfileInput[]
    deleteMany?: AddressScalarWhereInput | AddressScalarWhereInput[]
  }

  export type WishlistItemUpdateManyWithoutUserProfileNestedInput = {
    create?: XOR<WishlistItemCreateWithoutUserProfileInput, WishlistItemUncheckedCreateWithoutUserProfileInput> | WishlistItemCreateWithoutUserProfileInput[] | WishlistItemUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: WishlistItemCreateOrConnectWithoutUserProfileInput | WishlistItemCreateOrConnectWithoutUserProfileInput[]
    upsert?: WishlistItemUpsertWithWhereUniqueWithoutUserProfileInput | WishlistItemUpsertWithWhereUniqueWithoutUserProfileInput[]
    createMany?: WishlistItemCreateManyUserProfileInputEnvelope
    set?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    disconnect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    delete?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    update?: WishlistItemUpdateWithWhereUniqueWithoutUserProfileInput | WishlistItemUpdateWithWhereUniqueWithoutUserProfileInput[]
    updateMany?: WishlistItemUpdateManyWithWhereWithoutUserProfileInput | WishlistItemUpdateManyWithWhereWithoutUserProfileInput[]
    deleteMany?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[]
  }

  export type AddressUncheckedUpdateManyWithoutUserProfileNestedInput = {
    create?: XOR<AddressCreateWithoutUserProfileInput, AddressUncheckedCreateWithoutUserProfileInput> | AddressCreateWithoutUserProfileInput[] | AddressUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutUserProfileInput | AddressCreateOrConnectWithoutUserProfileInput[]
    upsert?: AddressUpsertWithWhereUniqueWithoutUserProfileInput | AddressUpsertWithWhereUniqueWithoutUserProfileInput[]
    createMany?: AddressCreateManyUserProfileInputEnvelope
    set?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    disconnect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    delete?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    update?: AddressUpdateWithWhereUniqueWithoutUserProfileInput | AddressUpdateWithWhereUniqueWithoutUserProfileInput[]
    updateMany?: AddressUpdateManyWithWhereWithoutUserProfileInput | AddressUpdateManyWithWhereWithoutUserProfileInput[]
    deleteMany?: AddressScalarWhereInput | AddressScalarWhereInput[]
  }

  export type WishlistItemUncheckedUpdateManyWithoutUserProfileNestedInput = {
    create?: XOR<WishlistItemCreateWithoutUserProfileInput, WishlistItemUncheckedCreateWithoutUserProfileInput> | WishlistItemCreateWithoutUserProfileInput[] | WishlistItemUncheckedCreateWithoutUserProfileInput[]
    connectOrCreate?: WishlistItemCreateOrConnectWithoutUserProfileInput | WishlistItemCreateOrConnectWithoutUserProfileInput[]
    upsert?: WishlistItemUpsertWithWhereUniqueWithoutUserProfileInput | WishlistItemUpsertWithWhereUniqueWithoutUserProfileInput[]
    createMany?: WishlistItemCreateManyUserProfileInputEnvelope
    set?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    disconnect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    delete?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[]
    update?: WishlistItemUpdateWithWhereUniqueWithoutUserProfileInput | WishlistItemUpdateWithWhereUniqueWithoutUserProfileInput[]
    updateMany?: WishlistItemUpdateManyWithWhereWithoutUserProfileInput | WishlistItemUpdateManyWithWhereWithoutUserProfileInput[]
    deleteMany?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[]
  }

  export type UserProfileCreateNestedOneWithoutAddressesInput = {
    create?: XOR<UserProfileCreateWithoutAddressesInput, UserProfileUncheckedCreateWithoutAddressesInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutAddressesInput
    connect?: UserProfileWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumAddressTypeFieldUpdateOperationsInput = {
    set?: $Enums.AddressType
  }

  export type UserProfileUpdateOneRequiredWithoutAddressesNestedInput = {
    create?: XOR<UserProfileCreateWithoutAddressesInput, UserProfileUncheckedCreateWithoutAddressesInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutAddressesInput
    upsert?: UserProfileUpsertWithoutAddressesInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutAddressesInput, UserProfileUpdateWithoutAddressesInput>, UserProfileUncheckedUpdateWithoutAddressesInput>
  }

  export type UserProfileCreateNestedOneWithoutWishlistInput = {
    create?: XOR<UserProfileCreateWithoutWishlistInput, UserProfileUncheckedCreateWithoutWishlistInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutWishlistInput
    connect?: UserProfileWhereUniqueInput
  }

  export type UserProfileUpdateOneRequiredWithoutWishlistNestedInput = {
    create?: XOR<UserProfileCreateWithoutWishlistInput, UserProfileUncheckedCreateWithoutWishlistInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutWishlistInput
    upsert?: UserProfileUpsertWithoutWishlistInput
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutWishlistInput, UserProfileUpdateWithoutWishlistInput>, UserProfileUncheckedUpdateWithoutWishlistInput>
  }

  export type EnumSellerStatusFieldUpdateOperationsInput = {
    set?: $Enums.SellerStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
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

  export type NestedEnumGenderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableFilter<$PrismaModel> | $Enums.Gender | null
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

  export type NestedEnumGenderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableWithAggregatesFilter<$PrismaModel> | $Enums.Gender | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGenderNullableFilter<$PrismaModel>
    _max?: NestedEnumGenderNullableFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumAddressTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AddressType | EnumAddressTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAddressTypeFilter<$PrismaModel> | $Enums.AddressType
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAddressTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AddressType | EnumAddressTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AddressType[] | ListEnumAddressTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAddressTypeWithAggregatesFilter<$PrismaModel> | $Enums.AddressType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAddressTypeFilter<$PrismaModel>
    _max?: NestedEnumAddressTypeFilter<$PrismaModel>
  }

  export type NestedEnumSellerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SellerStatus | EnumSellerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSellerStatusFilter<$PrismaModel> | $Enums.SellerStatus
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type NestedEnumSellerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SellerStatus | EnumSellerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SellerStatus[] | ListEnumSellerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSellerStatusWithAggregatesFilter<$PrismaModel> | $Enums.SellerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSellerStatusFilter<$PrismaModel>
    _max?: NestedEnumSellerStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type AddressCreateWithoutUserProfileInput = {
    id?: string
    label?: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    district?: string | null
    division?: string | null
    postalCode?: string | null
    country?: string
    isDefault?: boolean
    type?: $Enums.AddressType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressUncheckedCreateWithoutUserProfileInput = {
    id?: string
    label?: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    district?: string | null
    division?: string | null
    postalCode?: string | null
    country?: string
    isDefault?: boolean
    type?: $Enums.AddressType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressCreateOrConnectWithoutUserProfileInput = {
    where: AddressWhereUniqueInput
    create: XOR<AddressCreateWithoutUserProfileInput, AddressUncheckedCreateWithoutUserProfileInput>
  }

  export type AddressCreateManyUserProfileInputEnvelope = {
    data: AddressCreateManyUserProfileInput | AddressCreateManyUserProfileInput[]
    skipDuplicates?: boolean
  }

  export type WishlistItemCreateWithoutUserProfileInput = {
    id?: string
    productId: string
    addedAt?: Date | string
  }

  export type WishlistItemUncheckedCreateWithoutUserProfileInput = {
    id?: string
    productId: string
    addedAt?: Date | string
  }

  export type WishlistItemCreateOrConnectWithoutUserProfileInput = {
    where: WishlistItemWhereUniqueInput
    create: XOR<WishlistItemCreateWithoutUserProfileInput, WishlistItemUncheckedCreateWithoutUserProfileInput>
  }

  export type WishlistItemCreateManyUserProfileInputEnvelope = {
    data: WishlistItemCreateManyUserProfileInput | WishlistItemCreateManyUserProfileInput[]
    skipDuplicates?: boolean
  }

  export type AddressUpsertWithWhereUniqueWithoutUserProfileInput = {
    where: AddressWhereUniqueInput
    update: XOR<AddressUpdateWithoutUserProfileInput, AddressUncheckedUpdateWithoutUserProfileInput>
    create: XOR<AddressCreateWithoutUserProfileInput, AddressUncheckedCreateWithoutUserProfileInput>
  }

  export type AddressUpdateWithWhereUniqueWithoutUserProfileInput = {
    where: AddressWhereUniqueInput
    data: XOR<AddressUpdateWithoutUserProfileInput, AddressUncheckedUpdateWithoutUserProfileInput>
  }

  export type AddressUpdateManyWithWhereWithoutUserProfileInput = {
    where: AddressScalarWhereInput
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyWithoutUserProfileInput>
  }

  export type AddressScalarWhereInput = {
    AND?: AddressScalarWhereInput | AddressScalarWhereInput[]
    OR?: AddressScalarWhereInput[]
    NOT?: AddressScalarWhereInput | AddressScalarWhereInput[]
    id?: StringFilter<"Address"> | string
    userProfileId?: StringFilter<"Address"> | string
    label?: StringNullableFilter<"Address"> | string | null
    fullName?: StringFilter<"Address"> | string
    phone?: StringFilter<"Address"> | string
    addressLine1?: StringFilter<"Address"> | string
    addressLine2?: StringNullableFilter<"Address"> | string | null
    city?: StringFilter<"Address"> | string
    district?: StringNullableFilter<"Address"> | string | null
    division?: StringNullableFilter<"Address"> | string | null
    postalCode?: StringNullableFilter<"Address"> | string | null
    country?: StringFilter<"Address"> | string
    isDefault?: BoolFilter<"Address"> | boolean
    type?: EnumAddressTypeFilter<"Address"> | $Enums.AddressType
    createdAt?: DateTimeFilter<"Address"> | Date | string
    updatedAt?: DateTimeFilter<"Address"> | Date | string
  }

  export type WishlistItemUpsertWithWhereUniqueWithoutUserProfileInput = {
    where: WishlistItemWhereUniqueInput
    update: XOR<WishlistItemUpdateWithoutUserProfileInput, WishlistItemUncheckedUpdateWithoutUserProfileInput>
    create: XOR<WishlistItemCreateWithoutUserProfileInput, WishlistItemUncheckedCreateWithoutUserProfileInput>
  }

  export type WishlistItemUpdateWithWhereUniqueWithoutUserProfileInput = {
    where: WishlistItemWhereUniqueInput
    data: XOR<WishlistItemUpdateWithoutUserProfileInput, WishlistItemUncheckedUpdateWithoutUserProfileInput>
  }

  export type WishlistItemUpdateManyWithWhereWithoutUserProfileInput = {
    where: WishlistItemScalarWhereInput
    data: XOR<WishlistItemUpdateManyMutationInput, WishlistItemUncheckedUpdateManyWithoutUserProfileInput>
  }

  export type WishlistItemScalarWhereInput = {
    AND?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[]
    OR?: WishlistItemScalarWhereInput[]
    NOT?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[]
    id?: StringFilter<"WishlistItem"> | string
    userProfileId?: StringFilter<"WishlistItem"> | string
    productId?: StringFilter<"WishlistItem"> | string
    addedAt?: DateTimeFilter<"WishlistItem"> | Date | string
  }

  export type UserProfileCreateWithoutAddressesInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wishlist?: WishlistItemCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileUncheckedCreateWithoutAddressesInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wishlist?: WishlistItemUncheckedCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileCreateOrConnectWithoutAddressesInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutAddressesInput, UserProfileUncheckedCreateWithoutAddressesInput>
  }

  export type UserProfileUpsertWithoutAddressesInput = {
    update: XOR<UserProfileUpdateWithoutAddressesInput, UserProfileUncheckedUpdateWithoutAddressesInput>
    create: XOR<UserProfileCreateWithoutAddressesInput, UserProfileUncheckedCreateWithoutAddressesInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutAddressesInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutAddressesInput, UserProfileUncheckedUpdateWithoutAddressesInput>
  }

  export type UserProfileUpdateWithoutAddressesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wishlist?: WishlistItemUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutAddressesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wishlist?: WishlistItemUncheckedUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileCreateWithoutWishlistInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
    addresses?: AddressCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileUncheckedCreateWithoutWishlistInput = {
    id?: string
    userId: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    avatar?: string | null
    dateOfBirth?: Date | string | null
    gender?: $Enums.Gender | null
    createdAt?: Date | string
    updatedAt?: Date | string
    addresses?: AddressUncheckedCreateNestedManyWithoutUserProfileInput
  }

  export type UserProfileCreateOrConnectWithoutWishlistInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutWishlistInput, UserProfileUncheckedCreateWithoutWishlistInput>
  }

  export type UserProfileUpsertWithoutWishlistInput = {
    update: XOR<UserProfileUpdateWithoutWishlistInput, UserProfileUncheckedUpdateWithoutWishlistInput>
    create: XOR<UserProfileCreateWithoutWishlistInput, UserProfileUncheckedCreateWithoutWishlistInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutWishlistInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutWishlistInput, UserProfileUncheckedUpdateWithoutWishlistInput>
  }

  export type UserProfileUpdateWithoutWishlistInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    addresses?: AddressUpdateManyWithoutUserProfileNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutWishlistInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    addresses?: AddressUncheckedUpdateManyWithoutUserProfileNestedInput
  }

  export type AddressCreateManyUserProfileInput = {
    id?: string
    label?: string | null
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string | null
    city: string
    district?: string | null
    division?: string | null
    postalCode?: string | null
    country?: string
    isDefault?: boolean
    type?: $Enums.AddressType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WishlistItemCreateManyUserProfileInput = {
    id?: string
    productId: string
    addedAt?: Date | string
  }

  export type AddressUpdateWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateManyWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    district?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    type?: EnumAddressTypeFieldUpdateOperationsInput | $Enums.AddressType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemUpdateWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemUncheckedUpdateWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WishlistItemUncheckedUpdateManyWithoutUserProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
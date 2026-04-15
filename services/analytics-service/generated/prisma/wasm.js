
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.DailySalesReportScalarFieldEnum = {
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

exports.Prisma.VendorReportScalarFieldEnum = {
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

exports.Prisma.ProductAnalyticsScalarFieldEnum = {
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

exports.Prisma.CategoryAnalyticsScalarFieldEnum = {
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

exports.Prisma.UserAnalyticsScalarFieldEnum = {
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

exports.Prisma.EventLogScalarFieldEnum = {
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

exports.Prisma.SearchAnalyticsScalarFieldEnum = {
  id: 'id',
  query: 'query',
  resultsCount: 'resultsCount',
  clickedProductId: 'clickedProductId',
  userId: 'userId',
  sessionId: 'sessionId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  DailySalesReport: 'DailySalesReport',
  VendorReport: 'VendorReport',
  ProductAnalytics: 'ProductAnalytics',
  CategoryAnalytics: 'CategoryAnalytics',
  UserAnalytics: 'UserAnalytics',
  EventLog: 'EventLog',
  SearchAnalytics: 'SearchAnalytics'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

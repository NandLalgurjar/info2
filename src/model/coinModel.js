const { Schema, model } = require('mongoose');

const coinSchema = Schema({
    id: {
        type: String
    },
    symbol: {
        type: String
    },
    name: {
        type: String
    },
    asset_platform_id: {
        type: String
    },
    block_time_in_minutes: {
        type: Number
    },
    hashing_algorithm: {
        type: String
    },
    categories: {
        type: [String]
    },
    public_notice: {
        type: String
    },
    additional_notices: {
        type: [String]
    },
    localization: {
        type: Object,
        default: {}
    },

    description: {
        type: Object,
        default: {}
    },
    links: {
        type: Object,
        default: {}
    },
    image: {
        type: Object,
        default: {}
    },
    country_origin: {
        type: String
    },
    genesis_date: {
        type: String
    },
    sentiment_votes_up_percentage: {
        type: Number,
    },
    sentiment_votes_down_percentage: {
        type: Number,
    },
    watchlist_portfolio_users: {
        type: Number,
    },
    market_cap_rank: {
        type: Number,
    },
    coingecko_rank: {
        type: Number,
    },
    coingecko_score: {
        type: Number,
    },
    developer_score: {
        type: Number,
    },
    community_score: {
        type: Number,
    },
    liquidity_score: {
        type: Number,
    },
    public_interest_score: {
        type: Number,
    },
    market_data: {
        type: Object,
        default: {}
    },
    total_value_locked: {
        type: String,
    },
    mcap_to_tvl_ratio: {
        type: String,
    },
    fdv_to_tvl_ratio: {
        type: String,
    },
    roi: {
        type: String,
    },
    ath: {
        type: Object,
        default: {}
    },
    ath_change_percentage: {
        type: Object,
        default: {}
    },
    ath_date: {
        type: Object,
        default: {}
    },
    atl: {
        type: Object,
        default: {}
    },
    atl_change_percentage: {
        type: Object,
        default: {}
    },
    atl_date: {
        type: Object,
        default: {}
    },
    market_cap: {
        type: Object,
        default: {}
    },
    market_cap_rank: {
        type: Number,
    },
    fully_diluted_valuation: {
        type: Object,
        default: {}
    },
    total_volume: {
        type: Object,
        default: {}
    },
    high_24h: {
        type: Object,
        default: {}
    },
    low_24h: {
        type: Object,
        default: {}
    },
    price_change_24h: {
        type: Number,
    },
    price_change_percentage_24h: {
        type: Number,
    },
    price_change_percentage_7d: {
        type: Number,
    },
    price_change_percentage_14d: {
        type: Number,
    },
    price_change_percentage_30d: {
        type: Number,
    },
    price_change_percentage_60d: {
        type: Number,
    },
    price_change_percentage_200d: {
        type: Number,
    },
    price_change_percentage_1y: {
        type: Number,
    },
    market_cap_change_24h: {
        type: Number,
    },
    market_cap_change_percentage_24h: {
        type: Number,
    },
    price_change_24h_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_1h_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_24h_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_7d_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_14d_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_30d_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_60d_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_200d_in_currency: {
        type: Object,
        default: {}
    },
    price_change_percentage_1y_in_currency: {
        type: Object,
        default: {}
    },
    market_cap_change_24h_in_currency: {
        type: Object,
        default: {}
    },
    market_cap_change_percentage_24h_in_currency: {
        type: Object,
        default: {}
    },
    total_supply: {
        type: Number,
    },
    max_supply: {
        type: Number,
    },
    circulating_supply: {
        type: Number,
    },
    last_updated: {
        type: String,
    },
    community_data: {
        type: Object,
        default: {}
    },
    developer_data: {
        type: Object,
        default: {}
    },
    public_interest_stats: {
        type: Object,
        default: {}
    },
    actStatus:{
        type:String    //onHold active deactive
    }

}, { timestamps: true, versionKey: false });

module.exports = model('coin', coinSchema);

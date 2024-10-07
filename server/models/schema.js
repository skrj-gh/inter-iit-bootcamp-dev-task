import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    searches: { 
        type: [String], 
        default: [] 
    }
});

// Create a model from the schema
const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory
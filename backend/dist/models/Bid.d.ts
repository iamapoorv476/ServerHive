import mongoose from 'mongoose';
import { IBid } from '../types';
declare const Bid: mongoose.Model<IBid, {}, {}, {}, mongoose.Document<unknown, {}, IBid, {}, {}> & IBid & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Bid;
//# sourceMappingURL=Bid.d.ts.map
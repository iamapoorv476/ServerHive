import mongoose from 'mongoose';
import { IGig } from '../types';
declare const Gig: mongoose.Model<IGig, {}, {}, {}, mongoose.Document<unknown, {}, IGig, {}, {}> & IGig & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Gig;
//# sourceMappingURL=Gig.d.ts.map
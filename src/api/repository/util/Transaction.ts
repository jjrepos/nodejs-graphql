import { mongoose } from "@typegoose/typegoose";
import { logging } from "../../util/log/LogManager";

const logger = logging.getLogger("Transaction");

export function Transaction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    
    let method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        logger.trace("Starting transaction for method: " + method);
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let result = await method.apply(this, args);
            session.commitTransaction();
            logger.info("Completed transaction for method" + method);
            return result;
        } catch (error) {
            logger.error("Aborting transaction for method: " + method, error);
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
import { OperationType } from "../../src/api/model/OperationType";

export class OperationTypeComparator {

    /**
     * Compares all fields of a operation type.
     * @param received The operation type from resulting call.
     * @param expected The operation type to compare the result with.
     */
    static compareAllFields(received: any, expected: OperationType): void {
        expect(received.id).not.toBeNull;
        expect(received.name).toBe(expected.name);
        expect(received.desc).toBe(expected.desc);
        expect(received.createdAt).not.toBeNull;
        expect(received.createdAt).not.toBeNaN;
    }

     /**
     * Since the resolver returns the ids named "id" instead of the db's "_id",
     * this method covers that usecase.
     * @param recieved The operation from resulting call.
     * @param expected The operation to compare the result with.
     */
    static compareIds(recieved: any, expected: OperationType): void {
        expect(recieved.id).toEqual(expected._id);
    }
}
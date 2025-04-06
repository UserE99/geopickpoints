import { createPOIList, getPOIListById, deletePOIList } from "../../src/services/POIListsService";
import { POIList } from "../../src/model/POIListsModel";
import { Types } from "mongoose";

describe("POIList Service Tests", () => {
    afterEach(async () => {
        await POIList.deleteMany({});
    });

    test("Should create a POIList with valid data", async () => {
        const poilIds = [new Types.ObjectId().toString(), new Types.ObjectId().toString()];
        const newPOIList = { name: "Test POIList", poilId: poilIds };
        const poiList = await createPOIList(newPOIList);

        expect(poiList).toBeTruthy();
        expect(poiList.name).toBe("Test POIList");
        expect(poiList.poilId).toHaveLength(poilIds.length);
    });
    test("Should get a POIList by ID", async () => {
        const poilIds = [new Types.ObjectId(), new Types.ObjectId()];
        const poiList = await POIList.create({ name: "Test POIList", poilId: poilIds });

        const PoiListData = await getPOIListById(poiList._id.toString());
        expect(PoiListData).toBeTruthy();
        if (PoiListData) {
            // Check that the returned data matches the expected data
            expect(PoiListData.id).toBe(poiList._id.toString());
            expect(PoiListData.name).toBe(poiList.name);
            expect(PoiListData.poilId).toHaveLength(poilIds.length); 
            expect(PoiListData.poilId).toEqual(expect.arrayContaining(poilIds.map(id => id.toString()))); 
        }

    });

    test("Should delete a POIList by ID", async () => {
        const poilIds = [new Types.ObjectId(), new Types.ObjectId()];
        const poiList = await POIList.create({ name: "Test POIList", poilId: poilIds });

        const wasDeleted = await deletePOIList(poiList._id.toString());
        expect(wasDeleted).toBe(true);

        const deletedPOIList = await POIList.findById(poiList._id);
        expect(deletedPOIList).toBeNull();
    });

    test("Should return false when deleting non-existent POIList", async () => {
        const nonExistentId = new Types.ObjectId().toString();
        const wasDeleted = await deletePOIList(nonExistentId);

        expect(wasDeleted).toBe(false);

        const result = await POIList.findById(nonExistentId);
        expect(result).toBeNull();
    });
});

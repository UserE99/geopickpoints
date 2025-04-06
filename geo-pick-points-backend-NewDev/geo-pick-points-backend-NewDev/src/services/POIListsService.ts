import { POIListResource } from "src/Resources";
import { POIList, IPOIList } from "../model/POIListsModel";
import mongoose, { Types } from "mongoose";

/**
 * Erstellt eine neue POI-Liste
 */
export async function createPOIList(POIListResource: POIListResource): Promise<IPOIList> {
    try {
        const poiList = new POIList({
            name: POIListResource.name,
            poilId: POIListResource.poilId?.map((id) => new mongoose.Types.ObjectId(id)), 
        });

        const savePoiList = await poiList.save();

        return savePoiList;

    } catch (error: any) {
        throw new Error(`Fehler beim Erstellen des PoiList: ${error.message}`);
    }
}

/**
 * Holt eine POI-Liste anhand der ID
 */
export async function getPOIListById(id: string): Promise<POIListResource | null> {
    try {
        const poilist = await POIList.findById(id).exec();
        if (!poilist) return null;

        return {
            id: poilist._id.toString(),
            name: poilist.name,
            poilId: poilist.poilId.map((id) => id.toString()),
        };
    } catch (error) {
        console.error("Fehler im Service: ", error); 
        throw new Error("Fehler beim Abrufen der POI-Liste");
    }
}

/**
 * Löscht eine POI-Liste anhand der ID
 */
export async function deletePOIList(id: string): Promise<boolean> {
    const result = await POIList.findByIdAndDelete(id);
    return result !== null; // Gibt `true` zurück, wenn die POI-Liste gelöscht wurde
}

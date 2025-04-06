import * as GameService from "../services/GameService";
import { GameResource, POIListResource, POIResource } from "src/Resources";
import * as POIService from "../services/POIService";
import * as POILISTSService from "../services/POIListsService"
import { Types } from "mongoose";

export async function createExampleGame() {
    try {
        // Definiere alle POIs
        const berlinPOIs: POIResource[] = [
            { name: "Alexanderplatz", lat: 52.520008, long: 13.404954, beschreibung: "Ein belebter Platz mit Fernsehturm, Geschäften und urbanem Flair.", punkte: 100 },
            { name: "Brandenburger Tor", lat: 52.516275, long: 13.377704, beschreibung: "Ein ikonisches Monument und Symbol für Geschichte und Einheit.", punkte: 200 },
            { name: "Podsdamer Platz", lat: 52.509290, long: 13.376340, beschreibung: "Ein moderner Knotenpunkt mit Architektur, Kultur und Unterhaltung.", punkte: 100 },
            { name: "Oberbaumbrücke", lat: 52.501834, long: 13.445656, beschreibung: "Eine markante Brücke mit Doppeldeck-Architektur und historischem Charme.", punkte: 100 },
            { name: "Museumsinsel", lat: 52.516260, long: 13.402480, beschreibung: "Ein einzigartiges Kulturensemble mit weltberühmten Museen.", punkte: 100 },
            { name: "Volkspark Friedrichhain", lat: 52.528730, long: 13.442284, beschreibung: "Ein weitläufiger Park mit grünen Wiesen, Hügeln und Entspannungsoasen.", punkte: 50 },
            { name: "Deutsches Technikmuseum", lat: 52.498603, long: 13.378154, beschreibung: "Ein faszinierendes Museum mit historischen Exponaten zu Technik und Ingenieurskunst.", punkte: 50 },
            { name: "Checkpoint Charlie", lat: 52.507530, long: 13.390378, beschreibung: "Ein historischer Grenzpunkt und Symbol des Kalten Krieges.", punkte: 200 },
        ];

        const bhtPOIs: POIResource[] = [
            { name: "Workout Park", lat: 52.545374, long: 13.352802, beschreibung: "Workout Park", punkte: 50 },
            { name: "Spielplatz auf dem Zeppelinplatz", lat: 52.546413, long: 13.353094, beschreibung: "Spielplatz auf dem Zeppelinplatz", punkte: 200 },
            { name: "Einfahrt", lat: 52.546101, long: 13.355068, beschreibung: "Einfahrt", punkte: 50 },
            { name: "Fahrradständer Zeppelinplatz", lat: 52.545717, long: 13.351990, beschreibung: "Fahrradständer Zeppelinplatz", punkte: 100 },
            { name: "Eingang Zeppelinplatz", lat: 52.545879, long: 13.354316, beschreibung: "Eingang Zeppelinplatz", punkte: 100 },
        ];

        const potsdamPOIs: POIResource[] = [
            { name: "Park Sanssouci", lat: 52.40340322194994, long: 13.029932869765789, beschreibung: "Park Sanssouci", punkte: 50 },
            { name: "Filmpark Babelsberg", lat: 52.38494249076188, long: 13.11788422883501, beschreibung: "Filmpark Babelsberg", punkte: 200 },
            { name: "Glienicker Brücke", lat: 52.413617910656896, long: 13.090731035582499, beschreibung: "Glienicker Brücke", punkte: 50 },
            { name: "Schloss Cecilienhof", lat: 52.41958918275413, long: 13.070846179757533, beschreibung: "Schloss Cecilienhof", punkte: 100 },
            { name: "Biosphäre Potsdam", lat: 52.41901031179306, long: 13.049338804902431, beschreibung: "Biosphäre Potsdam", punkte: 100 },
        ];

        // Erstelle alle POIs und sammle die IDs
        const createPOIs = async (pois: POIResource[]): Promise<string[]> => {
            const poiIds: string[] = [];
            for (const poi of pois) {
                const fullData = await POIService.createPOI(poi);
                poiIds.push(fullData.id!);
            }
            return poiIds;
        };

        const berlinPoiIds = await createPOIs(berlinPOIs);
        const bhtPoiIds = await createPOIs(bhtPOIs);
        const potsdamPoiIds = await createPOIs(potsdamPOIs);

        // Spiel erstellen
        const gameData: GameResource = {
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            poilId: [...berlinPoiIds, ...bhtPoiIds],
            maxTeam: 5,
            userId: new Types.ObjectId().toString(),
        };
        await GameService.createGame(gameData);

        const gameDataPotsdam: GameResource = {
            title: "Potsdam Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Potsdam",
            poilId: [...potsdamPoiIds],
            maxTeam: 5,
            userId: new Types.ObjectId().toString(),
        };
        await GameService.createGame(gameDataPotsdam);


        //1.  POI-Liste Berlin erstellen
        const poiList: POIListResource = {
            name: "Berlin",
            poilId: [...berlinPoiIds, ...bhtPoiIds],
        };
        await POILISTSService.createPOIList(poiList);

        //2.  POI-Liste Potsdam erstellen
        const poiListPotsdam: POIListResource = {
            name: "Potsdam",
            poilId: [...potsdamPoiIds],
        };
        await POILISTSService.createPOIList(poiListPotsdam);

        console.log("Beispielspiel und POI-Liste erfolgreich erstellt.");
    } catch (error: any) {
        console.error("Fehler beim Erstellen des Beispielspiels:", error.message);
        throw error;
    }
}

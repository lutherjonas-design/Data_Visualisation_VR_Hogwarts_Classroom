import os
import json
import csv

# HIER ANPASSEN: Der Ordner, in dem deine fehlerhaften JSON-Dateien liegen
INPUT_FOLDER = "./"
OUTPUT_FOLDER = "./csv_output"

# Erstelle den Ausgabe-Ordner, falls er noch nicht existiert
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Spaltennamen für die finale CSV-Datei
CSV_HEADER = ["loc_x", "loc_y", "loc_z", "dir_x", "dir_y", "dir_z"]

def process_file(json_path, csv_path):
    print(f"Verarbeite: {json_path} -> {csv_path}")
    
    with open(json_path, "r", encoding="utf-8") as json_file, \
         open(csv_path, "w", encoding="utf-8", newline="") as csv_file:
        
        writer = csv.DictWriter(csv_file, fieldnames=CSV_HEADER)
        writer.writeheader()
        
        # Wir lesen alle Zeilen ein und filtern leere Zeilen heraus
        lines = [line.strip() for line in json_file if line.strip()]
        
        # Wir springen in 2er-Schritten durch die Datei (Zeile i und i+1)
        for i in range(0, len(lines) - 1, 2):
            try:
                # Zeile 1: Location
                loc_data = json.loads(lines[i])
                # Zeile 2: View Direction
                dir_data = json.loads(lines[i+1])
                
                # Zusammenführen in eine Zeile
                writer.writerow({
                    "loc_x": loc_data.get("x"),
                    "loc_y": loc_data.get("y"),
                    "loc_z": loc_data.get("z"),
                    "dir_x": dir_data.get("x"),
                    "dir_y": dir_data.get("y"),
                    "dir_z": dir_data.get("z")
                })
            except json.JSONDecodeError as e:
                print(f"Fehler beim Parsen in Zeile {i} oder {i+1}: {e}")

# Schleife über alle Dateien im Eingabe-Ordner
def main():
    for filename in os.listdir(INPUT_FOLDER):
        if filename.endswith(".json"):
            json_path = os.path.join(INPUT_FOLDER, filename)

            # Ändert die Dateiendung für den Output von .json zu .csv
            csv_filename = filename.rsplit(".", 1)[0] + ".csv"
            csv_path = os.path.join(OUTPUT_FOLDER, csv_filename)

            process_file(json_path, csv_path)

    print("Fertig! Alle Dateien wurden erfolgreich konvertiert.")

print(list(filter(lambda file: file.endswith(".json"), os.listdir(INPUT_FOLDER))))
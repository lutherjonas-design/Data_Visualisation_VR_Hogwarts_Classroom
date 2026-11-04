import React, { useState } from 'react';

export default function CourseMockup() {
    // Mock-Daten für den Header-Bereich
    // Mock-Daten für den Header-Bereich
    const courseDetails = {
        location: "Trainingszentrum Mitte (Halle 2)",
        time: "15:00 - 16:30 Uhr",
        date: "Montag, 22.06.2026"
    };

    // Liste der Personen (Proben zuerst, dann normale Mitglieder)
    const [people, setPeople] = useState([
        { id: 1, name: "Günther Bonadt", isTrial: true, hasComment: true, status: null },
        { id: 2, name: "Lina Schmidt", isTrial: true, hasComment: false, status: null },
        { id: 3, name: "Anna Müller", isTrial: false, hasComment: true, status: null },
        { id: 4, name: "Ben Wagner", isTrial: false, hasComment: false, status: null },
        { id: 5, name: "Emma Fischer", isTrial: false, hasComment: false, status: null }
    ]);

    // Funktion zum Handhaben der Status-Klicks (A, E oder F)
    const handleStatusChange = (id, clickedStatus) => {
        setPeople(prevPeople =>
            prevPeople.map(person => {
                if (person.id === id) {
                    return {
                        ...person,
                        status: person.status === clickedStatus ? null : clickedStatus
                    };
                }
                return person;
            })
        );
    };

    const presentCount = people.filter(p => p.status === 'A').length;
    const totalCount = people.length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto space-y-4">

                {/* Top Bar / Navigation, Kurs-Details, Große Anwesenheit & Kompakte Aktionen */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* 1. Navigation & Kursinfos (Links) */}
                    <div className="flex items-center gap-2 flex-1">

                        {/* Home Button */}
                        <button className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-bold border border-gray-200/50 shrink-0" title="Startseite">
                            🏠
                        </button>

                        {/* Linker Pfeil-Button (Genauso groß wie Home) */}
                        <button className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 text-sm font-bold border border-gray-200/50 shrink-0 select-none transition-colors" title="Vorheriger Kurs">
                            ◀
                        </button>

                        {/* Kurs-Info Block in der Mitte */}
                        <div className="space-y-0.5 px-1 min-w-0">
                            <span className="text-sm font-bold text-gray-900 block truncate">
                                Bodenturnen 5-8J
                            </span>
                            <div className="text-[11px] text-gray-500 flex flex-wrap gap-x-2 whitespace-nowrap">
                                <span>📍 {courseDetails.location}</span>
                                <span>🕒 {courseDetails.time}</span>
                            </div>
                        </div>

                        {/* Rechter Pfeil-Button (Genauso groß wie Home) */}
                        <button className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 text-sm font-bold border border-gray-200/50 shrink-0 select-none transition-colors" title="Nächster Kurs">
                            ▶
                        </button>

                    </div>

                    {/* 2. Große Anwesenheitsanzeige (Mitte) */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-1.5 min-w-[100px] self-start sm:self-center">
                        <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Anwesend</span>
                        <span className="text-xl font-black text-gray-900 leading-tight">
                            {presentCount} <span className="text-gray-300 font-normal">/</span> {totalCount}
                        </span>
                    </div>

                    {/* 3. Kompakte Plus-Buttons (Rechts) */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* + Mitglied */}
                        <button className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-bold border border-gray-200/50" title="Mitglied hinzufügen">
                            +👤
                        </button>
                        {/* + Probe */}
                        <button className="flex items-center justify-center w-9 h-9 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 text-sm font-bold border border-amber-200/50" title="Probe hinzufügen">
                            +⭐
                        </button>
                    </div>

                </div>

                {/* Anwesenheitsliste */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {people.map((person) => (
                            <div
                                key={person.id}
                                className={`flex items-center justify-between p-3 transition-colors ${person.isTrial
                                    ? 'bg-amber-50/20 hover:bg-amber-50/40 border-l-4 border-l-amber-400'
                                    : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'
                                    }`}
                            >
                                {/* Linke Seite: Icon + Name */}
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base select-none">
                                        {person.isTrial ? '⭐' : '👤'}
                                    </span>
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {person.name}
                                    </span>
                                </div>

                                {/* Rechte Seite: Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Kommentar / Notiz Button */}
                                    <button className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs transition-colors ${person.hasComment
                                        ? 'border-purple-200 bg-purple-50 text-purple-600'
                                        : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                                        }`}>
                                        💬
                                    </button>

                                    <div className="h-4 w-px bg-gray-200 mx-1"></div>

                                    {/* A - Anwesend Button */}
                                    <button
                                        onClick={() => handleStatusChange(person.id, 'A')}
                                        className={`w-8 h-8 rounded-lg border font-bold text-xs transition-all ${person.status === 'A'
                                            ? 'border-green-500 bg-green-500 text-white shadow-sm scale-105'
                                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        A
                                    </button>

                                    {/* E - Entschuldigt Button */}
                                    <button
                                        onClick={() => handleStatusChange(person.id, 'E')}
                                        className={`w-8 h-8 rounded-lg border font-bold text-xs transition-all ${person.status === 'E'
                                            ? 'border-amber-400 bg-amber-400 text-white shadow-sm scale-105'
                                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        E
                                    </button>

                                    {/* F - Unentschuldigt Fehlend Button */}
                                    <button
                                        onClick={() => handleStatusChange(person.id, 'F')}
                                        className={`w-8 h-8 rounded-lg border font-bold text-xs transition-all ${person.status === 'F'
                                            ? 'border-red-500 bg-red-500 text-white shadow-sm scale-105'
                                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        F
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}


/* export default function CourseMockup() {
  // Beispiel-Daten für die Kurskarten
  const courses = [
    { id: 1, center: "Trainingszentrum", title: "Bodenturnen 5-8J", day: "Montag", time: "15:00", members: "15 Mitglieder", trial: "1 Probe" },
    { id: 2, center: "Turnhalle West", title: "Geräteturnen 9-12J", day: "Mittwoch", time: "16:30", members: "12 Mitglieder", trial: "3 Proben" },
    { id: 3, center: "Sportpark Nord", title: "Akrobatik Jugendliche", day: "Freitag", time: "18:00", members: "18 Mitglieder", trial: "0 Proben" },
    { id: 4, center: "Turnhalle West", title: "Bodenturnen Fortgeschrittene", day: "Montag", time: "17:00", members: "10 Mitglieder", trial: "2 Proben" },
    { id: 5, center: "Trainingszentrum", title: "Eltern-Kind-Turnen", day: "Dienstag", time: "10:00", members: "20 Mitglieder", trial: "4 Proben" },
    { id: 6, center: "Sportpark Nord", title: "Trampolintraining", day: "Donnerstag", time: "16:00", members: "14 Mitglieder", trial: "1 Probe" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-md z-10 border-b border-gray-200/50 px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kursübersicht</h1>
            <p className="text-gray-500 mt-1">Finde den passenden Kurs für dich.</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
            
            <div className="w-full md:w-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Datum</label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 flex justify-between items-center cursor-default">
                <span>22.06.2026</span>
                <span className="text-gray-400 text-xs">📅</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filter nach</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 cursor-pointer">
                  <option value="trainer">Trainer</option>
                  <option value="ort">Ort</option>
                  <option value="uhrzeit">Uhrzeit</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-xs">▼</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Suchbegriff</label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-default">
                Suchbegriff eingeben...
              </div>
            </div>

            <button className="w-full md:w-auto bg-blue-600 text-white font-medium text-sm px-6 py-2 rounded-lg shadow-sm">
              Suchen
            </button>
          </div>

        </div>
      </div>

      <div className="px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    📍 {course.center}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">{course.day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{course.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{course.members}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span className="font-medium text-gray-700">{course.trial}</span>
                  </div>
                </div>

                <button className="w-full text-center bg-gray-100 text-gray-700 font-semibold text-xs py-2.5 rounded-lg">
                  Anwesenheit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
} */

import React, { useEffect, useState } from "react";

export default function EwidencjaBrakowApp() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ewidencja_brakow")) || [];
    } catch {
      return [];
    }
  });

  const [packNumber, setPackNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("ewidencja_brakow", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!packNumber.trim() || !productName.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      packNumber: packNumber.trim(),
      productName: productName.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      status: "waiting",
    };
    setItems((s) => [newItem, ...s]);
    setPackNumber("");
    setProductName("");
    setNotes("");
  };

  const markDone = (id) => {
    setItems((s) =>
      s.map((it) =>
        it.id === id ? { ...it, status: "done", doneAt: new Date().toISOString() } : it
      )
    );
  };

  const removeItem = (id) => {
    setItems((s) => s.filter((it) => it.id !== id));
  };

  const filtered = items.filter((it) => {
    if (filter === "waiting" && it.status !== "waiting") return false;
    if (filter === "done" && it.status !== "done") return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (it.packNumber + " " + it.productName + " " + (it.notes || "")).toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const header = ["id", "packNumber", "productName", "notes", "createdAt", "status", "doneAt"];
    const rows = items.map((r) => header.map((h) => (r[h] || "").toString().replace(/\n/g, " ")));
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c.replace(/\"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ewidencja_brakow_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ageHours = (iso) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000 / 3600;
    return diff;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Ewidencja braków — tablet</h1>
          <p className="text-sm opacity-70">Dodawaj brakujące produkty szybko — dotykowo i bez stresu.</p>
        </header>

        <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="p-3 rounded-lg border focus:outline-none text-lg"
              placeholder="Numer paczki"
              value={packNumber}
              onChange={(e) => setPackNumber(e.target.value)}
              inputMode="numeric"
            />

            <input
              className="p-3 rounded-lg border focus:outline-none text-lg"
              placeholder="Brakujący produkt"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <input
              className="p-3 rounded-lg border focus:outline-none text-lg"
              placeholder="Notatka (opcjonalnie)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={addItem}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg active:scale-95"
            >
              Dodaj do listy
            </button>

            <button
              onClick={() => {
                setPackNumber("");
                setProductName("");
                setNotes("");
              }}
              className="py-3 px-4 rounded-xl border font-medium"
            >
              Wyczyść
            </button>

            <button onClick={exportCSV} className="py-3 px-4 rounded-xl border font-medium">
              Eksport CSV
            </button>
          </div>
        </section>

        <section className="mb-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <input
                placeholder="Szukaj numeru / produktu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 rounded-lg border"
              />
            </div>

            <div className="flex gap-2">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 rounded-lg border">
                <option value="all">Wszystkie</option>
                <option value="waiting">Oczekujące</option>
                <option value="done">Uzupełnione</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-3">
            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm opacity-70 bg-white rounded-xl shadow">Brak pozycji.</div>
            )}

            {filtered.map((it) => {
              const hours = ageHours(it.createdAt);
              const alert = it.status === "waiting" && hours > 24;
              return (
                <div key={it.id} className={`p-4 bg-white rounded-2xl shadow flex gap-3 items-center ${alert ? "border-l-4 border-red-400" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm opacity-60">Paczka</div>
                        <div className="text-lg font-semibold">#{it.packNumber}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm opacity-60">Dodano</div>
                        <div className="text-sm">{new Date(it.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="text-sm opacity-60">Produkt</div>
                      <div className="text-lg font-medium">{it.productName}</div>
                      {it.notes && <div className="mt-1 text-sm opacity-70">{it.notes}</div>}
                    </div>

                    <div className="mt-3 flex gap-2 text-sm">
                      <div className={`px-2 py-1 rounded ${it.status === "waiting" ? "bg-yellow-100" : "bg-green-100"}`}>
                        {it.status === "waiting" ? "Oczekuje" : "Uzupełnione"}
                      </div>

                      {it.status === "waiting" && hours > 24 && <div className="px-2 py-1 rounded bg-red-100">&gt;24h</div>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {it.status === "waiting" ? (
                      <button onClick={() => markDone(it.id)} className="py-2 px-4 rounded-xl bg-blue-500 text-white shadow">Uzupełniono</button>
                    ) : (
                      <div className="py-2 px-4 rounded-xl bg-gray-100">Zrobione</div>
                    )}

                    <button onClick={() => removeItem(it.id)} className="py-2 px-4 rounded-xl border">Usuń</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-6 text-center text-xs opacity-60">Prototyp aplikacji — działa offline w przeglądarce (localStorage). Możemy rozbudować: eksport PDF, integracja z ERP.</footer>
      </div>
    </div>
  );
}

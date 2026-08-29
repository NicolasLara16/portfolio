"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

type Sortable = { id: string; order?: number; name?: string };

export function useCollection<T extends Sortable>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        setData(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as object) })) as T[]
        );
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Erro ao carregar "${collectionName}":`, err);
        setError("Não foi possível carregar os dados.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [collectionName]);

  const sorted = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          (a.order ?? 0) - (b.order ?? 0) ||
          (a.name ?? "").localeCompare(b.name ?? "")
      ),
    [data]
  );

  return { data: sorted, loading, error };
}

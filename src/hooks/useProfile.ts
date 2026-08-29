"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { defaultProfile } from "@/data/profile";
import type { Profile } from "@/lib/types";

/** Assine o documento `profile/main` e mescla com os valores padrão. */
export function useProfile(): Profile {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "profile", "main"),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as Partial<Profile>;
        setProfile({
          ...defaultProfile,
          ...data,
          education:
            Array.isArray(data.education) && data.education.length > 0
              ? data.education
              : defaultProfile.education,
        });
      },
      (err) => console.error("Erro ao carregar perfil:", err)
    );
    return unsubscribe;
  }, []);

  return profile;
}

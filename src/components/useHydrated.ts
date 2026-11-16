"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` en el servidor y en la hidratación; `true` después. Para lo que depende de la fecha o
 * la zona horaria del navegador sin desajustes de hidratación.
 */
export const useHydrated = () => useSyncExternalStore(subscribe, () => true, () => false);

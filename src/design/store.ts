import { reactive } from "./reactive";

export interface DesignState {
  activeTool: string;
  zoom: number;
  currentName: string;
  width: number;
  height: number;
  backgroundColor: string;
  preset: string;
  selectedIds: string[];
  layersCount: number;
  iconQuery: string;
}

export const initialStoreState: DesignState = {
  activeTool: "select",
  zoom: 1.0,
  currentName: "Untitled Design",
  width: 1200,
  height: 630,
  backgroundColor: "#ffffff",
  preset: "blank",
  selectedIds: [],
  layersCount: 0,
  iconQuery: "",
};

// Set of subscribers to listen for reactive state changes
const subscribers = new Set<(state: DesignState, key: keyof DesignState, value: any) => void>();

export const store = reactive(initialStoreState, (key, value, _oldValue) => {
  subscribers.forEach((sub) => sub(store, key, value));
});

export function subscribe(
  cb: (state: DesignState, key: keyof DesignState, value: any) => void
) {
  subscribers.add(cb);
  // Return an unsubscribe function
  return () => {
    subscribers.delete(cb);
  };
}

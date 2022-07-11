// TODO: Learn how to declare as a *.d.ts file, since these came from elsewhere.
// https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam
export interface PollOption {
  id: number;
  name: string;
  totalAmountRaised: number;
  [x: string]: any; // Optionally supports other properties.
}

export interface Poll {
  id: number;
  visible?: boolean;
  name: string;
  options: Array<PollOption>;
}

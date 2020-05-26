/**
 * Data from Editor.js
 */
export interface EditorData {
  /**
   * Time of last change
   */
  time: number;

  /**
   * Content blocks
   */
  blocks: {
    /**
     * Content type
     */
    type: string;

    /**
     * Content data
     */
    data: Record<string, unknown>;
  }[];

  /**
   * Editor's version
   */
  version: string;
}

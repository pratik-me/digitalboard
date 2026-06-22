import { TableNames } from "@/convex/_generated/dataModel";
import { DatabaseReader } from "@/convex/_generated/server";
import { GenericId } from "convex/values";


export async function getAllOrThrow<
  TableName extends TableNames
>(
  db: DatabaseReader,
  ids: GenericId<TableName>[]
) {
  // Fetching all documents concurrently
  const docs = await Promise.all(ids.map((id) => db.get(id)));

  // Mapping and validating each result
  return docs.map((doc: any, index: number) => {
    if (doc === null) {
      throw new Error(
        `Document with ID "${ids[index]}" not found in table.`
      );
    }
    return doc;
  });
}
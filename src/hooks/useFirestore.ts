import { useState, useEffect, useMemo, useCallback } from "react";
import {
  collection, getDocs, addDoc, doc, updateDoc, getDoc,
  query, where, orderBy, QueryConstraint, WhereFilterOp,
  WithFieldValue, DocumentReference, limit
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

interface Filter {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean | Date | null;
}

export const useFirestore = <T extends { id?: string }>(
  collectionName: string,
  orderByFields: { field: string; direction: "asc" | "desc" }[] = [],
  filters: Filter[] = [],
  limitParam?: number
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize dependencies to avoid unnecessary changes
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const memoizedOrderByFields = useMemo(
    () => orderByFields,
    [JSON.stringify(orderByFields)]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const queryConstraints: QueryConstraint[] = [];
      memoizedFilters.forEach((filter) => {
        queryConstraints.push(where(filter.field, filter.operator, filter.value));
      });
      memoizedOrderByFields.forEach((order) => {
        queryConstraints.push(orderBy(order.field, order.direction));
      });
      if (limitParam) {
        queryConstraints.push(limit(limitParam));
      }
      const q = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
      setData(newData);
    } catch (err) {
      console.error(err);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  }, [collectionName, memoizedFilters, memoizedOrderByFields, limitParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get all documents from a collection with optional filters
  const getCollection = async <T>(
    collectionName: string,
    filters: [string, WhereFilterOp, string | number | boolean | Date | null][] = [],
    orderByFields: { field: string; direction: "asc" | "desc" }[] = [],
    limitParam?: number
  ): Promise<T[]> => {
    setLoading(true);
    try {
      const queryConstraints: QueryConstraint[] = filters.map(([field, op, value]) => where(field, op, value));
      // Apply filters
      filters.forEach(([field, op, value]) => {
        queryConstraints.push(where(field, op, value));
      });
      // Apply sorting
      orderByFields.forEach((order) => {
        queryConstraints.push(orderBy(order.field, order.direction));
      });
      // Apply limit (if any)
      if (limitParam) {
        queryConstraints.push(limit(limitParam));
      }
      const q = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific document by its ID
  const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<T, "id">) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), item);
      const newItem = { id: docRef.id, ...item } as T;
      setData((prev) => [...prev, newItem]);
    } catch (err) {
      console.error(err);
      setError("Error adding data");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, updatedFields: Partial<T>) => {
    setLoading(true);
    try {
      const docRef: DocumentReference<T> = doc(db, collectionName, id) as DocumentReference<T>;
      await updateDoc(docRef, updatedFields as WithFieldValue<T>);
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
      );
    } catch (err) {
      console.log(err);
      setError("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addItem, updateItem, getCollection, getDocument };
};
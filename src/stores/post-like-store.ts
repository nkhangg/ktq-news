import { create } from 'zustand';

// Định nghĩa kiểu cho store
interface PostLikeStore {
    likeData: Pick<ILike, 'post' | 'action'> | null;
    setLikeData: (newLike: Pick<ILike, 'post' | 'action'> | null) => void;
}

const usePostLikeStore = create<PostLikeStore>((set) => ({
    likeData: null,
    setLikeData: (newLike: Pick<ILike, 'post' | 'action'> | null) => set({ likeData: newLike }),
}));

export default usePostLikeStore;

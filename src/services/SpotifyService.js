import {neon} from '@netlify/neon';

const sql = neon(import.meta.env.VITE_NETLIFY_DATABASE_URL);
console.log('Connected to the Neon PostgreSQL database.');

const SPOTIFY_USER_ID = import.meta.env.VITE_SPOTIFY_USER_ID;

export default {
    async getUserInfo() {
        try {
            const rows = await sql`SELECT *
                                   FROM users
                                   WHERE id = ${SPOTIFY_USER_ID}`;
            if (rows.length === 0) {
                throw new Error(`Failed to get user`);
            }
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getTopArtists() {
        return sql`
            SELECT DISTINCT a.*, ua.rank
            FROM artists a
                     JOIN user_artists ua ON a.id = ua.artist_id
                     JOIN artist_genres ag ON a.id = ag.artist_id
                     JOIN user_genres ug ON ag.genre_id = ug.genre_id
            WHERE ug.user_id = ${SPOTIFY_USER_ID}
            ORDER BY ua.rank
            LIMIT 10
        `;
    },
    async getTopTracks() {
        return sql`
            SELECT t.*
            FROM tracks t
                     JOIN user_tracks ut ON t.id = ut.track_id
            WHERE ut.user_id = ${SPOTIFY_USER_ID}
            ORDER BY ut.rank
            LIMIT 10
        `;
    },
    async getFavoriteGenres() {
        return sql`
            SELECT g.name, ug.count
            FROM genres g
                     JOIN user_genres ug ON g.id = ug.genre_id
            WHERE ug.user_id = ${SPOTIFY_USER_ID}
            ORDER BY ug.count DESC
            LIMIT 10
        `;
    }
};

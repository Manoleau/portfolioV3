import {neon} from '@netlify/neon';

// Use a try-catch block to handle potential errors with the database connection
let sql;
try {
    // Ensure the URL is properly formatted
    const dbUrl = import.meta.env.VITE_NETLIFY_DATABASE_URL;
    if (!dbUrl) {
        throw new Error('Database URL is not defined');
    }

    // Configure neon with options to handle fetch properly
    sql = neon(dbUrl, {
        // Add fetch options to ensure proper URL handling
        fetchOptions: {
            // Use default fetch behavior
            cache: 'no-cache',
            credentials: 'same-origin'
        }
    });

    console.log('Connected to the Neon PostgreSQL database.');
} catch (error) {
    console.error('Error connecting to database:', error);
    // Provide a fallback implementation that returns empty arrays
    sql = () => Promise.resolve([]);
}

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
        try {
            const result = await sql`
                SELECT DISTINCT a.*, ua.rank
                FROM artists a
                         JOIN user_artists ua ON a.id = ua.artist_id
                         JOIN artist_genres ag ON a.id = ag.artist_id
                         JOIN user_genres ug ON ag.genre_id = ug.genre_id
                WHERE ug.user_id = ${SPOTIFY_USER_ID}
                ORDER BY ua.rank
                LIMIT 10
            `;
            return result;
        } catch (error) {
            console.error('Error fetching top artists:', error);
            return [];
        }
    },
    async getTopTracks() {
        try {
            const result = await sql`
                SELECT t.*
                FROM tracks t
                         JOIN user_tracks ut ON t.id = ut.track_id
                WHERE ut.user_id = ${SPOTIFY_USER_ID}
                ORDER BY ut.rank
                LIMIT 10
            `;
            return result;
        } catch (error) {
            console.error('Error fetching top tracks:', error);
            return [];
        }
    },
    async getFavoriteGenres() {
        try {
            const result = await sql`
                SELECT g.name, ug.count
                FROM genres g
                         JOIN user_genres ug ON g.id = ug.genre_id
                WHERE ug.user_id = ${SPOTIFY_USER_ID}
                ORDER BY ug.count DESC
                LIMIT 10
            `;
            return result;
        } catch (error) {
            console.error('Error fetching favorite genres:', error);
            return [];
        }
    }
};

import {neon} from '@neondatabase/serverless';

let sql = neon(import.meta.env.VITE_NETLIFY_DATABASE_URL, {
    fetch: createCustomFetch(),
    fetchOptions: {
        cache: 'no-store',
        credentials: 'omit'
    },
    disableWarningInBrowsers: true
});

function createCustomFetch() {
    return (url, options = {}) => {
        try {
            let cleanUrl = url;

            if (typeof url === 'string') {
                cleanUrl = url
                    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '')
                    .replace(/[^\x20-\x7E]/g, (char) => encodeURIComponent(char));

                try {
                    new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
                } catch {
                    cleanUrl = encodeURI(url);
                }
            }

            return fetch(cleanUrl, {
                ...options,
                cache: 'no-store',
                credentials: 'omit'
            });
        } catch (error) {
            return Promise.reject(error);
        }
    };
}

const SPOTIFY_USER_ID = import.meta.env.VITE_SPOTIFY_USER_ID;

export default {
    async getUserInfo() {
        try {
            const rows = await sql`SELECT * FROM users WHERE id = ${SPOTIFY_USER_ID}`;

            if (rows.length === 0) {
                throw new Error(`No user found with ID: ${SPOTIFY_USER_ID}`);
            }
            return rows[0];
        } catch (error) {
            if (error.message.includes('Invalid name') || error.message.includes('fetch')) {
                try {
                    const fallbackSql = neon(import.meta.env.VITE_NETLIFY_DATABASE_URL, {
                        fetchOptions: {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            cache: 'no-store'
                        },
                        disableWarningInBrowsers: true
                    });

                    const fallbackRows = await fallbackSql`SELECT * FROM users WHERE id = ${SPOTIFY_USER_ID}`;
                    return fallbackRows[0];
                } catch (fallbackError) {
                }
            }

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
                LIMIT 20
            `;
            return result;
        } catch (error) {
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
                LIMIT 20
            `;
            return result;
        } catch (error) {
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
            return [];
        }
    }
};

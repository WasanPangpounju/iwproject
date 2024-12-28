import { Server } from 'socket.io';
import { mongoDB } from '@/lib/mongodb'; // เชื่อมต่อกับ MongoDB
import Chats from '@/models/chat'; // MongoDB โมเดล

let io;

export async function GET(req) {
    // เชื่อมต่อกับ MongoDB
    try {
        await mongoDB();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return new Response('MongoDB connection failed', { status: 500 });
    }

    // ตั้งค่า Socket.IO โดยใช้ path ที่เป็น /socket.io
    if (!io) {
        io = new Server({
            path: '/api/socket',
            cors: {
                origin: process.env.NEXT_PUBLIC_BASE_API_URL,  // หรือจะระบุ URL ของ client เช่น "http://localhost:3000"
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('send_message', async ({ userId, message, senderRole }) => {
                try {
                    const chat = await Chats.findOneAndUpdate(
                        { userId },
                        { $push: { roomChat: { message, senderRole, timestamp: new Date() } } },
                        { upsert: true, new: true }
                    );
                    io.emit('receive_message', chat);  // ส่งข้อความให้กับ Client ทุกคน
                } catch (error) {
                    console.error('Database error:', error);
                    socket.emit('error', { message: 'Unable to save chat' });
                }
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    return new Response('Socket.IO initialized', { status: 200 });
}

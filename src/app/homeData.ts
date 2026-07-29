const STORY_BASE = 'https://faithfightersamerica.com/';
const SHOP = 'https://shop.faithfightersforamerica.com/';

export interface Story {
    key: string;
    title: string;
    video: string;
    duration: string;
    desc: string;
}

export const STORY_IMG: Record<string, string> = {
    bills: '/images/img-01.jpg',
    car: '/images/img-02.jpg',
    hotel: '/images/img-03.jpg',
    prayers: '/images/img-05.png',
    rent: '/images/img-05.jpg',
    student: '/images/img-06.jpg',
};

export const STORIES: Story[] = [
    { key: 'bills', title: 'Bills Paid', video: `${STORY_BASE}video8.mp4`, duration: '0:57', desc: 'A family caught up on overdue utilities and kept the power on.' },
    { key: 'car', title: 'Car Payment Paid', video: `${STORY_BASE}video4.mp4`, duration: '0:34', desc: 'A worker kept the car that gets them to their job every day.' },
    { key: 'hotel', title: 'Hotel Stay Covered', video: `${STORY_BASE}video5.mp4`, duration: '1:12', desc: 'A family off the street and into a safe, warm place for the night.' },
    { key: 'prayers', title: 'Prayers Answered', video: `${STORY_BASE}video11.mp4`, duration: '0:32', desc: 'When hope had run out, the community showed up in force.' },
    { key: 'rent', title: 'Rent Covered', video: `${STORY_BASE}video7.mp4`, duration: '0:27', desc: 'A family kept their home when the rent came due.' },
    { key: 'student', title: 'Student Loans Paid Off', video: `${STORY_BASE}video6.mp4`, duration: '0:29', desc: 'A graduate set free from the weight of student debt.' },
];

export interface Product {
    name: string;
    price: string;
    img: string;
    url: string;
}

export const PRODUCTS: Product[] = [
    { name: "Men's Faith Tee", price: '30', img: '/images/serve-img.jpg', url: `${SHOP}products/wake-up-with-faith-mens-shirts` },
    { name: "Women's Faith Tank", price: '25', img: '/images/serve-img-2.jpg', url: `${SHOP}products/wake-up-with-faith-female-tanktops` },
    { name: 'Faith Fighters Hat', price: '25', img: '/images/serve-img-3.jpg', url: `${SHOP}products/wake-up-with-faith-hats` },
    { name: 'Wake Up With Faith Coffee', price: '25', img: '/images/serve-img-4.jpg', url: `${SHOP}products/wake-up-with-faith-cofee` },
];

import { ORAL_GUIDE } from "@/lib/data.server";
import OralGuideClient from "@/components/OralGuideClient";

export default function OralPrepPage() {
    const data = ORAL_GUIDE;

    // Optional: Add some server-side validation or processing if needed
    if (!data) {
        throw new Error("No se pudo cargar la guía oral.");
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8">
            <OralGuideClient data={data} />
        </div>
    );
}

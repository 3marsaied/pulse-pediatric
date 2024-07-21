from fastapi import FastAPI
from DataBase import engine
from models import base
from routes import auth, user, doctor, patient, appointment, MedicalRecord, reviews
from starlette.responses import RedirectResponse
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
base.metadata.create_all(bind=engine)

# Initialize FastAPI app with customized Swagger UI parameters
app = FastAPI(
    swagger_ui_parameters={
        "theme": "flattop",
        "dom_id": "#swagger-ui",
        "layout": "BaseLayout",
        "deepLinking": True,
        "showExtensions": True,
        "showCommonExtensions": True,
        "syntaxHighlight": {
            "theme": "obsidian"
        },
    }
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(doctor.router)
app.include_router(patient.router)
app.include_router(appointment.router)
app.include_router(MedicalRecord.router)
app.include_router(reviews.router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Pediatric-Pulse",
        version="1.0.0",
        description="This is an up to date version of the pediatric-pulse API doc.",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://i.imgur.com/jFo7NCX.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Redirect root to Swagger UI
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

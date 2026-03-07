const NutritionPlan = require("../models/NutritionPlan");
const path = require('path');
const fs = require('fs');
const { jsPDF } = require('jspdf');

// Liste plans nutrition
exports.getPlans = async (req,res)=>{
  try {
    const plans = await NutritionPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error("Erreur getPlans:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

// Obtenir un plan spécifique
exports.getPlanById = async (req, res) => {
  try {
    const plan = await NutritionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan nutrition non trouvé" });
    }
    res.json(plan);
  } catch (error) {
    console.error("Erreur getPlanById:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

// Générer un PDF pour un plan nutrition (avec jsPDF)
exports.generatePDF = async (req, res) => {
  try {
    const plan = await NutritionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan nutrition non trouvé" });
    }

    console.log("Génération PDF pour le plan:", plan.name);

    // Créer un nouveau document PDF
    const doc = new jsPDF();

    // Configuration des couleurs
    const primaryColor = [76, 175, 80];
    const secondaryColor = [46, 125, 50];
    const textColor = [33, 37, 41];
    const lightGray = [245, 245, 245];

    // En-tête
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(" " + plan.name.toUpperCase(), 105, 25, { align: 'center' });

    // Description
    doc.setFillColor(...lightGray);
    doc.rect(15, 50, 180, 30, 'F');
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(plan.description, 160);
    let yPosition = 60;
    splitDescription.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
    yPosition += 10;

    // Informations principales
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, 180, 25, 'F');
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Objectif: ${plan.objective.toUpperCase()} | Durée: ${plan.duration} jours | Calories: ${plan.caloriesPerDay} kcal/jour`, 20, yPosition + 15);

    // Macronutriments
    yPosition += 35;
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("", 20, yPosition);
    
    yPosition += 10;
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, 180, 30, 'F');
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Protéines: ${plan.macros.proteins}g`, 30, yPosition + 10);
    doc.text(`Glucides: ${plan.macros.carbs}g`, 80, yPosition + 10);
    doc.text(`Lipides: ${plan.macros.fats}g`, 130, yPosition + 10);

    // Plan repas
    yPosition += 40;
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("", 20, yPosition);

    if (plan.meals && plan.meals.length > 0) {
      plan.meals.forEach((meal, index) => {
        yPosition += 15;
        
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
          
          // En-tête de la nouvelle page
          doc.setFillColor(...primaryColor);
          doc.rect(0, 0, 210, 30, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text(plan.name.toUpperCase() + " (Suite)", 105, 20, { align: 'center' });
          yPosition = 40;
        }

        // En-tête du repas
        doc.setFillColor(...lightGray);
        doc.rect(15, yPosition, 180, 20, 'F');
        doc.setTextColor(...textColor);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${meal.name} - ${meal.type} (${meal.calories} kcal)`, 20, yPosition + 7);

        yPosition += 25;
        if (meal.instructions) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const splitInstructions = doc.splitTextToSize(meal.instructions, 170);
          splitInstructions.forEach(line => {
            doc.text(line, 20, yPosition);
            yPosition += 4;
          });
          yPosition += 5;
        }

        // Aliments
        if (meal.foods && meal.foods.length > 0) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text("", 20, yPosition);
          
          yPosition += 6;
          
          meal.foods.forEach(food => {
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(`• ${food.name} - ${food.quantity} (${food.calories} kcal)`, 25, yPosition);
            yPosition += 4;
          });
        }
        yPosition += 10;
      });
    }

    // Liste de courses
    if (plan.shoppingList && plan.shoppingList.length > 0) {
      yPosition += 20;
      doc.setTextColor(...textColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("", 20, yPosition);

      yPosition += 10;
      plan.shoppingList.forEach(item => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
          
          doc.setFillColor(...primaryColor);
          doc.rect(0, 0, 210, 30, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("LISTE DE COURSES (Suite)", 105, 20, { align: 'center' });
          yPosition = 40;
        }

        doc.setFillColor(...lightGray);
        doc.rect(15, yPosition, 180, 15, 'F');
        doc.setTextColor(...textColor);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`• ${item.item} - ${item.quantity} (${item.category})`, 20, yPosition + 5);
        yPosition += 20;
      });
    }

    // Conseils
    if (plan.tips && plan.tips.length > 0) {
      yPosition += 20;
      doc.setTextColor(...textColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("", 20, yPosition);

      plan.tips.forEach(tip => {
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
          
          doc.setFillColor(...primaryColor);
          doc.rect(0, 0, 210, 30, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("CONSEILS (Suite)", 105, 20, { align: 'center' });
          yPosition = 40;
        }

        yPosition += 10;
        doc.setFillColor(...lightGray);
        doc.rect(15, yPosition, 180, 30, 'F');
        
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(tip.title, 20, yPosition + 7);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const splitTip = doc.splitTextToSize(tip.content, 170);
        splitTip.forEach(line => {
          doc.text(line, 20, yPosition + 17);
          yPosition += 4;
        });
        yPosition += 13;
      });
    }

    // Pied de page
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 270, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Plan nutritionnel généré par FitnessApp", 105, 280, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 105, 290, { align: 'center' });
    doc.text("Pour de meilleurs résultats, consultez un nutritionniste professionnel.", 105, 295, { align: 'center' });

    // Sauvegarder le PDF
    const fileName = `nutrition-plan-${plan._id}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../public/pdfs', fileName);
    
    // Créer le dossier s'il n'existe pas
    const pdfsDir = path.dirname(filePath);
    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir, { recursive: true });
    }
    
    // Générer le buffer PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    fs.writeFileSync(filePath, pdfBuffer);
    
    // Mettre à jour le plan avec l'URL du PDF
    plan.pdfUrl = `/pdfs/${fileName}`;
    await plan.save();

    console.log("PDF généré avec succès:", fileName);

    // Envoyer le PDF en réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${plan.name.replace(/\s+/g, '_')}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erreur generatePDF:", error);
    res.status(500).json({ message: "Erreur lors de la génération du PDF", error: error.message });
  }
}

// Ajouter plan nutrition (admin)
exports.createPlan = async (req,res)=>{
  try {
    const plan = await NutritionPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    console.error("Erreur createPlan:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
package it.uniroma3.siw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import it.uniroma3.siw.service.ArtistaService;

@Controller
@RequestMapping("/artisti")
public class ArtistaController {

    @Autowired
    private ArtistaService artistaService;

    @GetMapping
    public String getListaArtisti(Model model) {
        model.addAttribute("artisti", this.artistaService.findAll());
        return "artisti/artistiList";
    }
}
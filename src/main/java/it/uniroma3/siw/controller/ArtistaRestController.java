package it.uniroma3.siw.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.model.Artista;
import it.uniroma3.siw.service.ArtistaService;
import jakarta.validation.Valid;

@RestController  
@RequestMapping("/api/artisti")
@CrossOrigin(origins = "http://localhost:5173") 
public class ArtistaRestController {
    @Autowired
    private ArtistaService artistaService;

    @GetMapping 
    public ResponseEntity<List<Artista>> getAllArtisti() {
        List<Artista> artisti = this.artistaService.findAll();
        return ResponseEntity.ok(artisti);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Artista> getArtistaById(@PathVariable Long id) {
        Artista artista = this.artistaService.findById(id); 
        
        if (artista != null) {
            return ResponseEntity.ok(artista);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Void> inserisciNuovoArtista(@Valid @RequestBody Artista artista) {
        this.artistaService.save(artista);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Void> modificaArtista(@PathVariable Long id, @Valid @RequestBody Artista datiAggiornati) {
        Artista artistaEsistente = this.artistaService.findById(id);
        if (artistaEsistente == null) {
            return ResponseEntity.notFound().build(); 
        }
        artistaEsistente.setNome(datiAggiornati.getNome());
        artistaEsistente.setDataNascita(datiAggiornati.getDataNascita());
        artistaEsistente.setNazionalita(datiAggiornati.getNazionalita());
        artistaEsistente.setImgUrl(datiAggiornati.getImgUrl());
        
        this.artistaService.save(artistaEsistente);
        return ResponseEntity.ok().build(); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminaArtista(@PathVariable Long id) {
        Artista artistaEsistente = this.artistaService.findById(id);
        if (artistaEsistente == null) {
            return ResponseEntity.notFound().build(); 
        }

        this.artistaService.delete(artistaEsistente);
        return ResponseEntity.ok().build(); 
    }
}